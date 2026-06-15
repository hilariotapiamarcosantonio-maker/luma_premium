import 'server-only';
import { randomUUID } from 'crypto';
import { CrmOperationsRepository } from './operations-repository';
import {
  CrmLeadOperation,
  CrmLeadNote,
  CrmActivityLog,
  UpdateOperationInput,
  CreateNoteInput,
  OperationsFilters
} from './operations-types';
import { UpdateOperationSchema, CreateNoteSchema, ActorEmailSchema } from './operations-schemas';

// In-memory global state databases for the mock layer
const mockOperations = new Map<string, CrmLeadOperation>();
const mockNotes = new Map<string, CrmLeadNote[]>();
const mockLogs = new Map<string, CrmActivityLog[]>();

export class MockOperationsRepository implements CrmOperationsRepository {
  /**
   * Resets the operational database maps to isolate data between test runs.
   */
  static reset(): void {
    mockOperations.clear();
    mockNotes.clear();
    mockLogs.clear();
  }

  async getOperationByLeadId(leadId: string): Promise<CrmLeadOperation | null> {
    return mockOperations.get(leadId) || null;
  }

  async listOperations(filters?: OperationsFilters): Promise<CrmLeadOperation[]> {
    let list = Array.from(mockOperations.values());

    if (filters) {
      if (filters.crm_status) {
        list = list.filter((o) => o.crm_status === filters.crm_status);
      }
      if (filters.owner_email) {
        list = list.filter((o) => o.owner_email === filters.owner_email);
      }
      if (filters.priority) {
        list = list.filter((o) => o.priority === filters.priority);
      }
      if (filters.next_action_due) {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        list = list.filter((o) => {
          if (!o.next_action_at) return filters.next_action_due === 'none';
          const due = new Date(o.next_action_at);

          if (filters.next_action_due === 'today') {
            return due >= startOfToday && due <= endOfToday;
          }
          if (filters.next_action_due === 'overdue') {
            return due < startOfToday && o.crm_status !== 'won' && o.crm_status !== 'lost';
          }
          if (filters.next_action_due === 'future') {
            return due > endOfToday;
          }
          return true;
        });
      }
    }

    return list;
  }

  async upsertOperation(input: UpdateOperationInput, actorEmail: string): Promise<CrmLeadOperation> {
    const validated = UpdateOperationSchema.parse(input);
    const validatedActor = ActorEmailSchema.parse(actorEmail);
    const leadId = validated.lead_id;
    const now = new Date().toISOString();

    const current = mockOperations.get(leadId);

    if (current) {
      // Concurrency check (Optimistic Locking)
      if (current.version !== validated.expected_version) {
        throw new Error('CONCURRENCY_ERROR');
      }

      const changes: { field: string; prev: string | null; next: string | null }[] = [];

      const updateField = <K extends keyof CrmLeadOperation>(
        field: K,
        nextVal: CrmLeadOperation[K]
      ) => {
        if (nextVal !== undefined && nextVal !== current[field]) {
          changes.push({
            field: String(field),
            prev: current[field] === null ? null : String(current[field]),
            next: nextVal === null ? null : String(nextVal),
          });
          current[field] = nextVal;
        }
      };

      if (validated.crm_status !== undefined) updateField('crm_status', validated.crm_status);
      if (validated.owner_email !== undefined) updateField('owner_email', validated.owner_email);
      if (validated.priority !== undefined) updateField('priority', validated.priority);
      if (validated.next_action_type !== undefined) updateField('next_action_type', validated.next_action_type);
      if (validated.next_action_at !== undefined) updateField('next_action_at', validated.next_action_at);
      if (validated.last_contact_at !== undefined) updateField('last_contact_at', validated.last_contact_at);
      if (validated.lost_reason !== undefined) updateField('lost_reason', validated.lost_reason);

      if (changes.length > 0) {
        current.version += 1;
        current.updated_at = now;
        current.updated_by = validatedActor;
        current.write_token = randomUUID();

        // Write activity logs for each field updated
        const logs = mockLogs.get(leadId) || [];
        changes.forEach((change) => {
          const logEntry: CrmActivityLog = {
            id: randomUUID(),
            lead_id: leadId,
            action_type: `update_${change.field}`,
            previous_value: change.prev,
            new_value: change.next,
            metadata: null,
            created_by: validatedActor,
            created_at: now,
          };
          logs.push(logEntry);
        });
        mockLogs.set(leadId, logs);
      }

      mockOperations.set(leadId, current);
      return current;
    } else {
      // Create new lead operations record
      const newOp: CrmLeadOperation = {
        lead_id: leadId,
        crm_status: validated.crm_status || 'new',
        owner_email: validated.owner_email || null,
        priority: validated.priority || 'medium',
        next_action_type: validated.next_action_type || null,
        next_action_at: validated.next_action_at || null,
        last_contact_at: validated.last_contact_at || null,
        lost_reason: validated.lost_reason || null,
        version: 1,
        write_token: randomUUID(),
        created_at: now,
        updated_at: now,
        updated_by: validatedActor,
      };

      mockOperations.set(leadId, newOp);

      // Log initial operation creation
      const logEntry: CrmActivityLog = {
        id: randomUUID(),
        lead_id: leadId,
        action_type: 'create_operation',
        previous_value: null,
        new_value: newOp.crm_status,
        metadata: null,
        created_by: validatedActor,
        created_at: now,
      };
      mockLogs.set(leadId, [logEntry]);

      return newOp;
    }
  }

  async listNotes(leadId: string): Promise<CrmLeadNote[]> {
    const notes = mockNotes.get(leadId) || [];
    // Sort: newest first (created_at desc)
    return [...notes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async createNote(input: CreateNoteInput, actorEmail: string): Promise<CrmLeadNote> {
    const validated = CreateNoteSchema.parse(input);
    const validatedActor = ActorEmailSchema.parse(actorEmail);
    const leadId = validated.lead_id;
    const now = new Date().toISOString();

    const noteEntry: CrmLeadNote = {
      id: randomUUID(),
      lead_id: leadId,
      body: validated.body,
      created_by: validatedActor,
      created_at: now,
      updated_at: null,
    };

    const notes = mockNotes.get(leadId) || [];
    notes.push(noteEntry);
    mockNotes.set(leadId, notes);

    // Log note creation in activity log
    const logs = mockLogs.get(leadId) || [];
    const logEntry: CrmActivityLog = {
      id: randomUUID(),
      lead_id: leadId,
      action_type: 'add_note',
      previous_value: null,
      new_value: validated.body.slice(0, 50),
      metadata: JSON.stringify({ note_id: noteEntry.id }),
      created_by: validatedActor,
      created_at: now,
    };
    logs.push(logEntry);
    mockLogs.set(leadId, logs);

    return noteEntry;
  }

  async listActivity(leadId: string): Promise<CrmActivityLog[]> {
    const logs = mockLogs.get(leadId) || [];
    // Sort: newest first (created_at desc)
    return [...logs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}
