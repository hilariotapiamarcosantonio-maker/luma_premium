import 'server-only';
import { randomBytes, randomUUID } from 'crypto';
import { getManualLeadsRepository, ManualLead } from './manual-leads-repository';
import { getCrmRepository } from './repository';
import { LeadDetail } from './types';
import { getAuthorizedUser, getSalesEmails } from '../auth/authorized-users';
import { normalizePhoneNumber } from './normalizers';
import { CreateManualLeadSchema, CreateManualLeadResponse } from './manual-lead-schema';
import { CrmLeadOperation, CrmActivityLog } from './operations-types';


export async function executeCreateManualLead(
  rawInput: unknown,
  session: { user?: { email?: string | null } } | null
): Promise<CreateManualLeadResponse> {
  try {
    // 1. Authenticate session
    if (!session || !session.user || !session.user.email) {
      return { success: false, error: 'UNAUTHENTICATED' };
    }

    // 2. Resolve authorized user and role
    const user = getAuthorizedUser(session.user.email);
    if (!user) {
      return { success: false, error: 'UNAUTHORIZED' };
    }

    // 3. Validate input with Zod
    const parseResult = CreateManualLeadSchema.safeParse(rawInput);
    if (!parseResult.success) {
      return { success: false, error: 'VALIDATION_ERROR', message: parseResult.error.issues[0]?.message };
    }

    const input = parseResult.data;

    // 4. Force owner_email rules based on role
    let finalOwnerEmail = '';
    if (user.role === 'sales') {
      // Sales cannot choose owner. Always force to their own normalized session
      // email, regardless of any owner_email sent by the client. This prevents a
      // Sales agent from assigning a lead to another user and does not depend on
      // the ordering of CRM_SALES_EMAILS.
      finalOwnerEmail = user.email;
    } else if (user.role === 'admin') {
      // Admin must select a valid owner
      if (!input.owner_email) {
        return { success: false, error: 'VALIDATION_ERROR', message: 'El responsable es obligatorio' };
      }
      const salesEmails = getSalesEmails();
      const normalizedInputOwner = input.owner_email.trim().toLowerCase();
      if (!salesEmails.has(normalizedInputOwner)) {
        return { success: false, error: 'VALIDATION_ERROR', message: 'El responsable seleccionado no está autorizado en el CRM' };
      }
      finalOwnerEmail = normalizedInputOwner;
    } else {
      return { success: false, error: 'UNAUTHORIZED' };
    }

    // 5. Clean / Normalize phone number and email
    const cleanedPhone = input.phone ? normalizePhoneNumber(input.phone) : '';
    const phoneDigits = cleanedPhone.replace(/\D/g, '');
    const cleanedEmail = input.email ? input.email.trim().toLowerCase() : '';

    // Validate that at least one exists (phone with digits OR cleaned email)
    if (phoneDigits.length === 0 && cleanedEmail.length === 0) {
      return {
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Debe ingresar al menos un número de teléfono válido (con dígitos) o un correo electrónico.',
      };
    }

    const newEmailNorm = cleanedEmail;
    const newPhoneDigits = phoneDigits;

    // A: Retrieve Luma Leads V2 leads
    const leadRepo = await getCrmRepository();
    const allSourceLeads: LeadDetail[] = [];
    let page = 1;
    const pageSize = 100;
    while (true) {
      const res = await leadRepo.listLeads({ page, page_size: pageSize });
      if (!res.leads || res.leads.length === 0) break;
      allSourceLeads.push(...res.leads);
      if (page >= res.totalPages || allSourceLeads.length >= res.totalCount) break;
      page++;
    }

    // B: Retrieve ManualLeads
    const manualLeadsRepo = await getManualLeadsRepository();
    const allManualLeads = await manualLeadsRepo.listManualLeads();

    // Check duplicate in source leads
    for (const lead of allSourceLeads) {
      const leadEmailNorm = lead.email ? lead.email.trim().toLowerCase() : '';
      const leadPhoneDigits = lead.phone ? lead.phone.replace(/\D/g, '') : '';

      if (newEmailNorm && leadEmailNorm && newEmailNorm === leadEmailNorm) {
        return { success: false, error: 'DUPLICATE_LEAD', existingLeadId: lead.id, message: 'Ya existe un lead con este correo electrónico.' };
      }
      if (newPhoneDigits && leadPhoneDigits && newPhoneDigits === leadPhoneDigits) {
        return { success: false, error: 'DUPLICATE_LEAD', existingLeadId: lead.id, message: 'Ya existe un lead con este número de teléfono.' };
      }
    }

    // Check duplicate in manual leads
    for (const lead of allManualLeads) {
      const leadEmailNorm = lead.email ? lead.email.trim().toLowerCase() : '';
      const leadPhoneDigits = lead.phone ? lead.phone.replace(/\D/g, '') : '';

      if (newEmailNorm && leadEmailNorm && newEmailNorm === leadEmailNorm) {
        return { success: false, error: 'DUPLICATE_LEAD', existingLeadId: lead.lead_id, message: 'Ya existe un lead manual con este correo electrónico.' };
      }
      if (newPhoneDigits && leadPhoneDigits && newPhoneDigits === leadPhoneDigits) {
        return { success: false, error: 'DUPLICATE_LEAD', existingLeadId: lead.lead_id, message: 'Ya existe un lead manual con este número de teléfono.' };
      }
    }

    // 7. Generate cryptographically secure lead_id
    // lm_ followed by 24 secure random hex/alphanumeric characters
    const secureRandomHex = randomBytes(12).toString('hex');
    const leadId = `lm_${secureRandomHex}`;

    const now = new Date().toISOString();

    // 8. Parse / validate priority
    let finalPriority: 'low' | 'medium' | 'high' = 'medium';
    if (input.priority === 'low' || input.priority === 'medium' || input.priority === 'high') {
      finalPriority = input.priority;
    }

    // 9. Prepare Lead details (Force source to 'manual')
    const leadRecord: ManualLead = {
      lead_id: leadId,
      full_name: input.full_name,
      phone: cleanedPhone,
      email: cleanedEmail,
      company: input.company || '',
      country: input.country || '',
      language: input.language,
      industry: input.industry || '',
      investment_range: input.investment_range || 'Necesito diagnóstico antes de definirlo',
      capture_channel: input.capture_channel,
      campaign: input.campaign,
      source: 'manual',
      capture_status: 'manual',
      consent_to_contact: input.consent_to_contact,
      created_at: now,
      created_by: user.email,
      updated_at: null,
    };

    // 10. Prepare CrmLeadOperation record
    const operationRecord: CrmLeadOperation = {
      lead_id: leadId,
      crm_status: 'new',
      owner_email: finalOwnerEmail,
      priority: finalPriority,
      next_action_type: null,
      next_action_at: null,
      last_contact_at: null,
      lost_reason: null,
      version: 1,
      write_token: randomUUID(),
      created_at: now,
      updated_at: now,
      updated_by: user.email,
    };

    // 11. Prepare CrmActivityLog records
    const activityRecord: CrmActivityLog = {
      id: randomUUID(),
      lead_id: leadId,
      action_type: 'create_operation',
      previous_value: null,
      new_value: 'new',
      metadata: null,
      created_by: user.email,
      created_at: now,
    };

    const activities: CrmActivityLog[] = [activityRecord];

    // 12. Prepare CrmLeadNote record if initial_note is not empty
    let noteRecord = null;
    if (input.initial_note && input.initial_note.trim().length > 0) {
      noteRecord = {
        id: randomUUID(),
        lead_id: leadId,
        body: input.initial_note.trim(),
        created_by: user.email,
        created_at: now,
        updated_at: null,
      };

      // Add 'add_note' log activity aligned with mock & Sheets
      activities.push({
        id: randomUUID(),
        lead_id: leadId,
        action_type: 'add_note',
        previous_value: null,
        new_value: 'Nota agregada',
        metadata: JSON.stringify({ note_id: noteRecord.id }),
        created_by: user.email,
        created_at: now,
      });
    }

    // 13. Perform the atomic write
    await manualLeadsRepo.createManualLeadWithOperation(
      leadRecord,
      operationRecord,
      activities,
      noteRecord
    );

    return { success: true, leadId };

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error executing create manual lead:', errorMsg);
    return { success: false, error: 'INTERNAL_ERROR' };
  }
}
