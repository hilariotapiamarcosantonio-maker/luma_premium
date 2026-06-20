import { normalizePhoneNumber, getPhoneDigits, mapManualLeadToLeadDetail } from '../src/lib/crm/normalizers';
import { executeCreateManualLead } from '../src/lib/crm/create-manual-lead-service';
import { executeUpdateLeadOperation } from '../src/lib/crm/update-lead-operation-service';
import { MockManualLeadsRepository, GoogleSheetsManualLeadsRepository, resetManualLeadsRepositoryValidation, getManualLeadsRepository } from '../src/lib/crm/manual-leads-repository';
import { MockCrmRepository } from '../src/lib/crm/mock-repository';
import { MockOperationsRepository, mockOperations, mockNotes, mockLogs } from '../src/lib/crm/mock-operations-repository';
import { CrmReadService } from '../src/lib/crm/crm-read-service';
import * as fs from 'fs';
import * as path from 'path';

// Set environment variables for mock runs
process.env.CRM_ADMIN_EMAILS = 'marcoshilario@lumapremium.com';
process.env.CRM_SALES_EMAILS = 'blaancoperla@gmail.com,william-ficticio@example.com';
process.env.CRM_OPERATIONS_MODE = 'mock';
process.env.CRM_DATA_MODE = 'mock';
process.env.LUMA_CRM_OPS_SPREADSHEET_ID = 'test-spreadsheet-id';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

async function runTests() {
  console.log('Running Manual Leads MVP tests...');

  // 1. Phone number normalization
  assert(normalizePhoneNumber(' +1 (809) 555-1234 ') === '+18095551234', 'Keeps plus and strips formatting');
  assert(normalizePhoneNumber(' 18095551234 ') === '18095551234', 'Strips formatting without leading plus');
  assert(getPhoneDigits('+1 (809) 555-1234') === '18095551234', 'Extracts digits only for comparison');
  assert(getPhoneDigits('18095551234') === '18095551234', 'Extracts digits only without plus');
  assert(normalizePhoneNumber('555-1234') === '5551234', 'Does not invent country code for local number');

  // 2. static Client schema check (should not import server-only or node libraries)
  const schemaPath = path.join(__dirname, '../src/lib/crm/manual-lead-schema.ts');
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  assert(!schemaContent.includes('server-only'), 'Client schema does not import server-only');
  assert(!schemaContent.includes('googleapis'), 'Client schema does not import googleapis');
  assert(!schemaContent.includes('create-manual-lead-service'), 'Client schema does not import server-only services');

  // Reset repositories
  MockManualLeadsRepository.reset();
  MockCrmRepository.reset();
  MockOperationsRepository.reset();

  const adminSession = { user: { email: 'marcoshilario@lumapremium.com' } };
  const salesSession = { user: { email: 'blaancoperla@gmail.com' } };

  // 3. Create manual lead with initial note
  const createRes = await executeCreateManualLead({
    full_name: 'Lead Manual Test',
    phone: '+1 (809) 555-0001',
    email: 'manual.test@example.com',
    company: 'Test Company',
    country: 'DO',
    language: 'es',
    industry: 'Tecnología, software y SaaS',
    investment_range: 'US$5,000–10,000',
    owner_email: 'william-ficticio@example.com',
    priority: 'high',
    initial_note: 'Esta es una nota inicial importante.',
  }, adminSession);

  assert(createRes.success === true, 'Admin successfully created manual lead');
  const leadId = createRes.leadId!;
  assert(leadId.startsWith('lm_'), 'Lead ID starts with lm_');
  assert(leadId.length === 27, 'Lead ID total length is 27 characters');
  assert(/^[a-f0-9]{24}$/.test(leadId.substring(3)), 'Generates 24 cryptographically secure hex characters after lm_');

  // 4. Operational State defaults (priority: medium by default, version: 1, crm_status: new)
  const createdOp = mockOperations.get(leadId);
  assert(createdOp !== undefined, 'LeadOperations record created');
  assert(createdOp?.crm_status === 'new', 'CRM status is new');
  assert(createdOp?.priority === 'high', 'CRM priority matches selected priority');
  assert(createdOp?.version === 1, 'CRM operation version is 1');
  assert(createdOp?.owner_email === 'william-ficticio@example.com', 'Responsable properly set to william-ficticio@example.com');

  // 5. Note creation check
  const createdNotes = mockNotes.get(leadId);
  assert(createdNotes !== undefined && createdNotes.length === 1, 'Initial note created');
  assert(createdNotes?.[0]?.body === 'Esta es una nota inicial importante.', 'Note body matches');

  // 6. Activity log check & alignment (create_operation and add_note are generated identically)
  const createdLogs = mockLogs.get(leadId);
  assert(createdLogs !== undefined && createdLogs.length === 2, 'Exactly two activity logs created (create_operation & add_note)');
  assert(createdLogs?.[0]?.action_type === 'create_operation', 'First activity log is create_operation');
  assert(createdLogs?.[1]?.action_type === 'add_note', 'Second activity log is add_note');

  // 7. Duplication checks
  // A: Duplicate by email against ManualLeads
  const dupEmailRes = await executeCreateManualLead({
    full_name: 'Duplicate Email Lead',
    email: 'manual.test@example.com', // same email
    phone: '+1 (809) 999-9999',
    owner_email: 'william-ficticio@example.com',
  }, adminSession);
  assert(dupEmailRes.success === false, 'Duplicate email rejected');
  assert(dupEmailRes.error === 'DUPLICATE_LEAD', 'Error code is DUPLICATE_LEAD');
  assert(dupEmailRes.existingLeadId === leadId, 'Returns existing lead ID');

  // B: Duplicate by phone against ManualLeads (differing only by plus symbol)
  const dupPhoneRes = await executeCreateManualLead({
    full_name: 'Duplicate Phone Lead',
    email: 'other.email@example.com',
    phone: '18095550001', // same digits, no plus or formatting
    owner_email: 'william-ficticio@example.com',
  }, adminSession);
  assert(dupPhoneRes.success === false, 'Duplicate phone digits rejected');
  assert(dupPhoneRes.error === 'DUPLICATE_LEAD', 'Error code is DUPLICATE_LEAD');
  assert(dupPhoneRes.existingLeadId === leadId, 'Returns existing lead ID');

  // C: Duplicate by email against Luma Leads V2
  const sourceLead = {
    id: 'lp_abcdef1234567890abcdef12',
    schema_version: 'v2',
    created_at: new Date().toISOString(),
    locale: 'es' as const,
    country: 'MX',
    full_name: 'Source Lead',
    email: 'source.lead@example.com',
    phone: '+52 55 1234 5678',
    company: 'Source Co',
    role: '',
    industry: 'Otros',
    industry_detail: '',
    team_size: '',
    lead_volume: '',
    acquisition_channels: '',
    advertising_status: '',
    current_tools: '',
    main_bottleneck: '',
    desired_outcome: '',
    solution_interest: '',
    timeline: '',
    investment_range: 'Necesito diagnóstico antes de definirlo',
    source: 'web',
    page_origin: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    utm_term: '',
    status: 'nuevo',
    platform: 'other' as const,
    channel: 'unknown' as const,
    raw_investment_range: '',
    raw_industry: '',
    raw_country: '',
    raw_source: '',
    raw_utm_source: '',
    raw_utm_medium: '',
    raw_utm_campaign: '',
    raw_page_origin: '',
  };
  MockCrmRepository.mockLeads = [sourceLead];

  const dupSourceEmailRes = await executeCreateManualLead({
    full_name: 'Duplicate Source Lead',
    email: 'source.lead@example.com', // same email
    owner_email: 'william-ficticio@example.com',
  }, adminSession);
  assert(dupSourceEmailRes.success === false, 'Duplicate email against Luma Leads V2 rejected');
  assert(dupSourceEmailRes.existingLeadId === sourceLead.id, 'Returns source lead ID');

  // 8. Permissions checks (Create)
  // A: Sales (blaancoperla, the FIRST CRM_SALES_EMAILS entry) is forced to own their own
  // lead, ignoring any owner_email submitted by the client.
  const salesCreateRes = await executeCreateManualLead({
    full_name: 'Sales Created Lead',
    email: 'sales.created@example.com',
    owner_email: 'william-ficticio@example.com', // input trying to set another Sales
  }, salesSession);
  assert(salesCreateRes.success === true, 'Sales (blaancoperla) successfully created lead');
  const salesLeadId = salesCreateRes.leadId!;
  const salesOp = mockOperations.get(salesLeadId);
  assert(salesOp?.owner_email === 'blaancoperla@gmail.com', 'Sales owner forced to their own session email (blaancoperla), ignoring submitted owner_email');

  // B: Admin selecting invalid owner email
  const adminInvalidOwnerRes = await executeCreateManualLead({
    full_name: 'Admin Invalid Owner Lead',
    email: 'admin.invalid.owner@example.com',
    owner_email: 'not-authorized@example.com', // invalid owner
  }, adminSession);
  assert(adminInvalidOwnerRes.success === false, 'Admin selecting unauthorized owner is rejected');
  assert(adminInvalidOwnerRes.error === 'VALIDATION_ERROR', 'Rejection code is VALIDATION_ERROR');

  // 9. Force source: 'manual' and consent default value false
  const forceTestRes = await executeCreateManualLead({
    full_name: 'Forced Fields Lead',
    email: 'forced.fields@example.com',
    owner_email: 'blaancoperla@gmail.com',
    source: 'google-organic', // Browser attempts to send source
    // Omit consent_to_contact to check default value false
  }, adminSession);
  assert(forceTestRes.success === true, 'Forced fields lead created successfully');
  const manualRepoMock = await getManualLeadsRepository();
  const forcedLead = await manualRepoMock.getManualLeadById(forceTestRes.leadId!);
  assert(forcedLead?.source === 'manual', 'Source field is forced to manual in backend');
  assert(forcedLead?.capture_status === 'manual', 'Capture status is forced to manual in backend');
  assert(forcedLead?.consent_to_contact === false, 'Consent to contact defaults to false when omitted');

  // 10. Permissions checks (Read: List/Get)
  const leadRepo = new MockCrmRepository();
  const opsRepo = new MockOperationsRepository();
  const readService = new CrmReadService(leadRepo, opsRepo);

  // Sales A session (blaancoperla@gmail.com)
  const salesSessionA = { user: { email: 'blaancoperla@gmail.com' } };
  // Sales B session (william-ficticio@example.com)
  const salesSessionB = { user: { email: 'william-ficticio@example.com' } };

  // Sales A list leads (should only see leads assigned to blaancoperla@gmail.com)
  const listForA = await readService.listLeads({ page: 1, page_size: 10 }, salesSessionA.user);
  // assigned to A: salesLeadId, forceTestRes.leadId
  assert(listForA.leads.length === 2, 'Sales A can only list leads assigned to their email');
  const containsB = listForA.leads.some(l => l.id === leadId); // leadId was assigned to william-ficticio
  assert(containsB === false, 'Sales A list does not contain Sales B leads');

  // Sales A attempts to direct-get a lead assigned to Sales B
  try {
    await readService.getLeadById(leadId, salesSessionA.user);
    assert(false, 'Sales A should be forbidden from accessing Sales B lead details');
  } catch (err: any) {
    assert(err.name === 'ForbiddenError', 'Accessing unassigned lead throws ForbiddenError');
  }

  // Sales A direct-gets their own assigned lead
  const ownLeadDetail = await readService.getLeadById(salesLeadId, salesSessionA.user);
  assert(ownLeadDetail !== null && ownLeadDetail.id === salesLeadId, 'Sales A can successfully access their own lead details');

  // Admin gets any lead
  const adminDetail = await readService.getLeadById(leadId, adminSession.user);
  assert(adminDetail !== null && adminDetail.id === leadId, 'Admin can access any lead details');

  // 11. Tab headers mismatch validation & non-overwrite checks
  const repo = new GoogleSheetsManualLeadsRepository();
  let updateCalled = false;
  
  // Mock internal getSheetsClient to return fake spreadsheets api
  (repo as any).getSheetsClient = async () => {
    return {
      spreadsheets: {
        get: async () => ({
          data: {
            sheets: [
              { properties: { title: 'ManualLeads', sheetId: 101 } },
              { properties: { title: 'LeadOperations', sheetId: 102 } },
              { properties: { title: 'ActivityLog', sheetId: 103 } },
              { properties: { title: 'LeadNotes', sheetId: 104 } }
            ]
          }
        }),
        values: {
          get: async ({ range }: { range: string }) => {
            if (range.startsWith('ManualLeads')) {
              // Simula encabezados incorrectos
              return { data: { values: [['wrong_id', 'full_name', 'phone']] } };
            }
            return { data: { values: [[]] } };
          },
          update: async () => {
            updateCalled = true;
            return {};
          }
        }
      }
    };
  };

  resetManualLeadsRepositoryValidation(); // Clean module-level promise cache
  try {
    await (repo as any).ensureValidated();
    assert(false, 'Should have failed validation because of mismatched headers');
  } catch (err: any) {
    assert(err.message.includes('CRM_HEADER_MISMATCH'), 'Throws header mismatch error');
    assert(updateCalled === false, 'Does not overwrite headers on Google Sheets when they are mismatched');
  }

  // 12. Rejected phone "---" without email
  const invalidPhoneRes = await executeCreateManualLead({
    full_name: 'Invalid Phone Lead',
    phone: '---',
    email: '',
    owner_email: 'william-ficticio@example.com',
  }, adminSession);
  assert(invalidPhoneRes.success === false, 'Rejects phone "---" without email');
  assert(invalidPhoneRes.error === 'VALIDATION_ERROR', 'Phone "---" rejection error is VALIDATION_ERROR');

  // 13. Uppercase email normalization and storage check
  const uppercaseEmailRes = await executeCreateManualLead({
    full_name: 'Uppercase Email Lead',
    email: '  UPPERCASE.TEST@EXAMPLE.COM  ',
    phone: '+1 (809) 555-0099',
    owner_email: 'william-ficticio@example.com',
    investment_range: 'US$10,000–20,000',
  }, adminSession);
  assert(uppercaseEmailRes.success === true, 'Successfully created lead with uppercase email');
  const storedLead = await manualRepoMock.getManualLeadById(uppercaseEmailRes.leadId!);
  assert(storedLead?.email === 'uppercase.test@example.com', 'Stores email in trimmed lowercase format');

  // 14. Individual and combined filters check
  // Filter by status
  const statusFilterRes = await readService.listLeads({ page: 1, page_size: 10, status: 'new' }, adminSession.user);
  assert(statusFilterRes.leads.every(l => l.crm_status === 'new'), 'Filtering by status works');

  // Filter by locale
  const esFilterRes = await readService.listLeads({ page: 1, page_size: 10, locale: 'es' }, adminSession.user);
  assert(esFilterRes.leads.every(l => l.locale === 'es'), 'Filtering by locale es works');

  // Filter by country
  const countryFilterRes = await readService.listLeads({ page: 1, page_size: 10, country: 'DO' }, adminSession.user);
  assert(countryFilterRes.leads.every(l => l.country === 'DO'), 'Filtering by country DO works');

  // Filter by industry
  const industryFilterRes = await readService.listLeads({ page: 1, page_size: 10, industry: 'Tecnología, software y SaaS' }, adminSession.user);
  assert(industryFilterRes.leads.every(l => l.industry === 'Tecnología, software y SaaS'), 'Filtering by industry works');

  // Filter by investment range
  const rangeFilterRes = await readService.listLeads({ page: 1, page_size: 10, investment_range: 'US$5,000–10,000' }, adminSession.user);
  assert(rangeFilterRes.leads.every(l => l.investment_range === 'US$5,000–10,000'), 'Filtering by investment range works');

  // Combined filters check
  const combinedFilterRes = await readService.listLeads({
    page: 1,
    page_size: 10,
    status: 'new',
    locale: 'es',
    country: 'DO',
    industry: 'Tecnología, software y SaaS'
  }, adminSession.user);
  assert(combinedFilterRes.leads.length > 0, 'Combined filtering returns matched leads');
  assert(combinedFilterRes.leads.every(l =>
    l.crm_status === 'new' &&
    l.locale === 'es' &&
    l.country === 'DO' &&
    l.industry === 'Tecnología, software y SaaS'
  ), 'Combined filtering matches all criteria');

  // 15. Permissions before pagination (totalCount represent all user leads before slicing)
  const paginatedForA = await readService.listLeads({ page: 1, page_size: 1 }, salesSessionA.user);
  assert(paginatedForA.totalCount === 2, 'Total count represents all sales user leads before pagination');
  assert(paginatedForA.leads.length === 1, 'Returns exactly 1 lead for page_size=1');

  // 16. Descending sorting by created_at date
  const sortedLeadsRes = await readService.listLeads({ page: 1, page_size: 10 }, adminSession.user);
  let isSorted = true;
  for (let i = 0; i < sortedLeadsRes.leads.length - 1; i++) {
    const dateA = new Date(sortedLeadsRes.leads[i]!.created_at).getTime();
    const dateB = new Date(sortedLeadsRes.leads[i+1]!.created_at).getTime();
    if (dateA < dateB) {
      isSorted = false;
      break;
    }
  }
  assert(isSorted === true, 'Leads are sorted in descending order of created_at');

  // 17. Metrics complete including manual leads
  const adminMetrics = await readService.getDashboardMetrics(adminSession.user);
  assert(adminMetrics.totalLeads > MockCrmRepository.mockLeads!.length, 'Admin dashboard metrics include manual leads');
  assert(adminMetrics.leadsWithPhone >= 2, 'Admin dashboard metrics include manual leads with phone');
  assert(adminMetrics.leadsWithBudget >= 2, 'Admin dashboard metrics include manual leads with budget');

  // 18. Restricted metrics for Sales
  const salesMetricsA = await readService.getDashboardMetrics(salesSessionA.user);
  assert(salesMetricsA.totalLeads === 2, 'Sales A metrics are restricted to assigned leads only');
  assert(salesMetricsA.byCrmStatus.new === 2, 'Sales A status metrics reflect only assigned leads');

  // 19. Google Sheets Validation error recovery cache check
  const repoRecover = new GoogleSheetsManualLeadsRepository();
  let getCallCount = 0;
  let updateCalledRecover = false;
  
  (repoRecover as any).getSheetsClient = async () => {
    return {
      spreadsheets: {
        get: async () => ({
          data: {
            sheets: [
              { properties: { title: 'ManualLeads', sheetId: 101 } },
              { properties: { title: 'LeadOperations', sheetId: 102 } },
              { properties: { title: 'ActivityLog', sheetId: 103 } },
              { properties: { title: 'LeadNotes', sheetId: 104 } }
            ]
          }
        }),
        values: {
          get: async ({ range }: { range: string }) => {
            getCallCount++;
            if (getCallCount === 1) {
              // First call: mismatch headers on ManualLeads to trigger error
              return { data: { values: [['wrong_id', 'full_name']] } };
            }
            // Subsequent calls: correct headers
            if (range.startsWith('ManualLeads')) {
              return { data: { values: [['lead_id', 'full_name', 'phone', 'email', 'company', 'country', 'language', 'industry', 'investment_range', 'capture_channel', 'campaign', 'source', 'capture_status', 'consent_to_contact', 'created_at', 'created_by', 'updated_at']] } };
            }
            if (range.startsWith('LeadOperations')) {
              return { data: { values: [['lead_id', 'crm_status', 'owner_email', 'priority', 'next_action_type', 'next_action_at', 'last_contact_at', 'lost_reason', 'version', 'write_token', 'created_at', 'updated_at', 'updated_by']] } };
            }
            if (range.startsWith('ActivityLog')) {
              return { data: { values: [['id', 'lead_id', 'action_type', 'previous_value', 'new_value', 'metadata', 'created_by', 'created_at']] } };
            }
            return { data: { values: [['id', 'lead_id', 'body', 'created_by', 'created_at', 'updated_at']] } };
          },
          update: async () => {
            updateCalledRecover = true;
            return {};
          }
        }
      }
    };
  };

  resetManualLeadsRepositoryValidation();
  // Attempt 1: Should fail
  try {
    await (repoRecover as any).ensureValidated();
    assert(false, 'First validation should have failed');
  } catch (err: any) {
    assert(err.message.includes('CRM_HEADER_MISMATCH'), 'First validation failed with mismatch error');
  }

  // Attempt 2: Should succeed because the cache was reset after failure
  try {
    await (repoRecover as any).ensureValidated();
    assert(true, 'Second validation succeeded after recovering from first failure');
  } catch (err: any) {
    assert(false, 'Second validation should not have failed');
  }

  // 20. Exact submit button label "Agregar lead" check
  const formPath = path.join(__dirname, '../src/components/crm/ManualLeadForm.tsx');
  const formContent = fs.readFileSync(formPath, 'utf-8');
  assert(formContent.includes('>Agregar lead<'), 'Form submit button has exact label "Agregar lead"');

  // 21. Specific filter tests and sorting-before-pagination check
  const lead1 = {
    ...sourceLead,
    id: 'lp_1',
    utm_campaign: 'campaign-1',
    platform: 'google' as const,
    channel: 'paid_search' as const,
    created_at: '2026-06-01T12:00:00Z',
  };
  const lead2 = {
    ...sourceLead,
    id: 'lp_2',
    utm_campaign: 'campaign-2',
    platform: 'meta' as const,
    channel: 'organic_social' as const,
    created_at: '2026-06-05T12:00:00Z',
  };
  const lead3 = {
    ...sourceLead,
    id: 'lp_3',
    utm_campaign: 'campaign-1',
    platform: 'linkedin' as const,
    channel: 'paid_social' as const,
    created_at: '2026-06-10T12:00:00Z',
  };
  MockCrmRepository.mockLeads = [lead1, lead2, lead3];

  // utm_campaign filter
  const campaignRes = await readService.listLeads({ page: 1, page_size: 10, utm_campaign: 'campaign-1' }, adminSession.user);
  assert(campaignRes.leads.length === 2 && campaignRes.leads.every(l => l.utm_campaign === 'campaign-1'), 'Filtering by utm_campaign campaign-1 works');

  // platform filter
  const platformRes = await readService.listLeads({ page: 1, page_size: 10, platform: 'meta' }, adminSession.user);
  assert(platformRes.leads.length === 1 && platformRes.leads[0]?.id === 'lp_2', 'Filtering by platform meta works');

  // channel filter
  const channelRes = await readService.listLeads({ page: 1, page_size: 10, channel: 'paid_social' }, adminSession.user);
  assert(channelRes.leads.length === 1 && channelRes.leads[0]?.id === 'lp_3', 'Filtering by channel paid_social works');

  // date_from filter
  const dateFromRes = await readService.listLeads({ page: 1, page_size: 10, date_from: '2026-06-03T00:00:00Z' }, adminSession.user);
  assert(
    dateFromRes.leads.some(l => l.id === 'lp_1') === false &&
    dateFromRes.leads.some(l => l.id === 'lp_2') === true &&
    dateFromRes.leads.some(l => l.id === 'lp_3') === true,
    'Filtering by date_from works'
  );

  // date_to filter
  const dateToRes = await readService.listLeads({ page: 1, page_size: 10, date_to: '2026-06-07T00:00:00Z' }, adminSession.user);
  assert(dateToRes.leads.length === 2 && dateToRes.leads.every(l => l.id === 'lp_1' || l.id === 'lp_2'), 'Filtering by date_to works');

  // order before pagination check
  const paginationOrderRes = await readService.listLeads({ page: 3, page_size: 2 }, adminSession.user);
  assert(paginationOrderRes.leads.length === 2, 'Returns page of size 2');
  assert(paginationOrderRes.leads[0]?.id === 'lp_3', 'Sorted before pagination: index 4 is lp_3');
  assert(paginationOrderRes.leads[1]?.id === 'lp_2', 'Sorted before pagination: index 5 is lp_2');

  // 22. Confirmation of navigation link text in leads page
  const listPagePath = path.join(__dirname, '../src/app/admin/(protected)/leads/page.tsx');
  const listPageContent = fs.readFileSync(listPagePath, 'utf-8');
  const linkRegex = /<Link\s+href="\/admin\/leads\/nuevo"[\s\S]*?>([\s\S]*?)<\/Link>/;
  const matchLink = listPageContent.match(linkRegex);
  assert(matchLink !== null, 'Leads page contains Link to /admin/leads/nuevo');
  assert(matchLink !== null && matchLink[1].trim() === 'Agregar lead', 'Leads page link to new lead has exact text "Agregar lead"');

  // 23. getSourceCampaignOptions tests
  // A: getSourceCampaignOptions() rejects when called without user
  try {
    await (readService as any).getSourceCampaignOptions(undefined);
    assert(false, 'getSourceCampaignOptions should throw error when called without user');
  } catch (err: any) {
    assert(err.name === 'UnauthorizedError', 'Throws UnauthorizedError when called without user');
  }

  // Setup campaigns and owners for test
  const campaignLeadA = {
    ...sourceLead,
    id: 'lp_campaign_a',
    utm_campaign: 'campaign-exclusive-a',
    created_at: '2026-06-12T12:00:00Z',
  };
  const campaignLeadB = {
    ...sourceLead,
    id: 'lp_campaign_b',
    utm_campaign: 'campaign-exclusive-b',
    created_at: '2026-06-13T12:00:00Z',
  };
  MockCrmRepository.mockLeads = [campaignLeadA, campaignLeadB];

  // Set operations to assign them to Sales A and Sales B respectively
  mockOperations.set('lp_campaign_a', {
    lead_id: 'lp_campaign_a',
    crm_status: 'new',
    owner_email: 'blaancoperla@gmail.com',
    priority: 'medium',
    next_action_type: null,
    next_action_at: null,
    last_contact_at: null,
    lost_reason: null,
    version: 1,
    write_token: 'token-a',
    created_at: '2026-06-12T12:00:00Z',
    updated_at: '2026-06-12T12:00:00Z',
    updated_by: 'system',
  });

  mockOperations.set('lp_campaign_b', {
    lead_id: 'lp_campaign_b',
    crm_status: 'new',
    owner_email: 'william-ficticio@example.com',
    priority: 'medium',
    next_action_type: null,
    next_action_at: null,
    last_contact_at: null,
    lost_reason: null,
    version: 1,
    write_token: 'token-b',
    created_at: '2026-06-13T12:00:00Z',
    updated_at: '2026-06-13T12:00:00Z',
    updated_by: 'system',
  });

  // B: Admin receives campaigns from the complete set
  const adminCampaigns = await readService.getSourceCampaignOptions(adminSession.user);
  assert(adminCampaigns.includes('campaign-exclusive-a') && adminCampaigns.includes('campaign-exclusive-b'), 'Admin receives campaigns from the complete set');

  // C: Sales A does not receive campaigns belonging exclusively to Sales B
  const salesACampaigns = await readService.getSourceCampaignOptions(salesSessionA.user);
  assert(salesACampaigns.includes('campaign-exclusive-a') === true, 'Sales A receives campaigns of their own leads');
  assert(salesACampaigns.includes('campaign-exclusive-b') === false, 'Sales A does not receive campaigns belonging exclusively to Sales B');

  // D: Confirm leads page passes authInfo.user
  assert(
    listPageContent.includes('readService.getSourceCampaignOptions(authInfo.user)'),
    '/admin/leads calls getSourceCampaignOptions passing authInfo.user'
  );

  // 24. Security tests: assert that calling read service methods without user throws UnauthorizedError
  // listLeads
  try {
    await (readService as any).listLeads({ page: 1 });
    assert(false, 'listLeads should throw error when called without user');
  } catch (err: any) {
    assert(err.name === 'UnauthorizedError', 'listLeads throws UnauthorizedError when called without user');
  }

  // getLeadById
  try {
    await (readService as any).getLeadById('some-id');
    assert(false, 'getLeadById should throw error when called without user');
  } catch (err: any) {
    assert(err.name === 'UnauthorizedError', 'getLeadById throws UnauthorizedError when called without user');
  }

  // getDashboardMetrics
  try {
    await (readService as any).getDashboardMetrics();
    assert(false, 'getDashboardMetrics should throw error when called without user');
  } catch (err: any) {
    assert(err.name === 'UnauthorizedError', 'getDashboardMetrics throws UnauthorizedError when called without user');
  }

  // getSourceCampaignOptions
  try {
    await (readService as any).getSourceCampaignOptions();
    assert(false, 'getSourceCampaignOptions should throw error when called without user');
  } catch (err: any) {
    assert(err.name === 'UnauthorizedError', 'getSourceCampaignOptions throws UnauthorizedError when called without user');
  }

  // 25. Regression (owner forced to authenticated Sales session, independent of CRM_SALES_EMAILS order)
  // CRM_SALES_EMAILS is 'blaancoperla@gmail.com,william-ficticio@example.com'. A DIFFERENT Sales
  // agent than the first entry (william, the SECOND entry) must become the owner of their OWN
  // lead — proving the owner is the authenticated session email and does NOT depend on the
  // ordering of CRM_SALES_EMAILS, and that a Sales cannot force another Sales as owner.
  const salesSessionWilliam = { user: { email: 'william-ficticio@example.com' } };
  const salesBCreateRes = await executeCreateManualLead({
    full_name: 'Second Sales Own Lead',
    email: 'second.sales.own@example.com',
    owner_email: 'blaancoperla@gmail.com', // tries to force the FIRST sales as owner
  }, salesSessionWilliam);
  assert(salesBCreateRes.success === true, 'Second Sales (william) successfully created their own lead');
  const salesBLeadId = salesBCreateRes.leadId!;
  const salesBOp = mockOperations.get(salesBLeadId);
  assert(salesBOp?.owner_email === 'william-ficticio@example.com', 'Second Sales owner forced to their own session email (william), not salesEmails[0]');
  assert(salesBOp?.owner_email !== 'blaancoperla@gmail.com', 'Second Sales cannot force another Sales (blaancoperla) as owner via the form');

  // Sales B can list and access their own newly created lead; Sales A (blaancoperla) cannot.
  const listForWilliam = await readService.listLeads({ page: 1, page_size: 50 }, salesSessionWilliam.user);
  assert(listForWilliam.leads.some(l => l.id === salesBLeadId), 'Second Sales can list their own lead');
  try {
    await readService.getLeadById(salesBLeadId, { email: 'blaancoperla@gmail.com' });
    assert(false, 'Blaancoperla should be forbidden from accessing william lead');
  } catch (err: any) {
    assert(err.name === 'ForbiddenError', 'Other Sales (blaancoperla) is forbidden from accessing william own lead');
  }

  // 26. Regression (Hallazgo 1): CRM update on a MANUAL lead (lm_) must be accepted.
  // Reproduces the exact reported QA case: estado=Reunión programada, prioridad=Alta,
  // próxima acción futura, último contacto anterior (incluso anterior a la creación).
  // The lead_id starts with 'lm_' (manual), which previously failed LeadIdSchema (/^lp_.../).
  const updLeadId = salesBLeadId; // manual lead (lm_), owned by william, version 1
  const futureNextActionIso = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
  const pastLastContactIso = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
  const qaUpdateRes = await executeUpdateLeadOperation({
    lead_id: updLeadId,
    crm_status: 'meeting_scheduled',
    priority: 'high',
    next_action_type: 'Reunión',
    next_action_at: futureNextActionIso,
    last_contact_at: pastLastContactIso,
    lost_reason: null,
    expected_version: 1,
  }, salesSessionWilliam);
  assert(updLeadId.startsWith('lm_'), 'QA update target is a manual lead (lm_)');
  assert(qaUpdateRes.success === true, 'CRM update on manual lead (lm_) is accepted (meeting_scheduled + high + dates)');
  assert(qaUpdateRes.operation?.crm_status === 'meeting_scheduled', 'Status saved as meeting_scheduled');
  assert(qaUpdateRes.operation?.priority === 'high', 'Priority saved as high');
  assert(qaUpdateRes.operation?.next_action_at === futureNextActionIso, 'Future next_action_at accepted and saved');
  assert(qaUpdateRes.operation?.last_contact_at === pastLastContactIso, 'Past last_contact_at accepted and saved');
  assert(qaUpdateRes.operation?.version === 2, 'Version incremented to 2 (version control & audit preserved)');

  // 27. last_contact_at in the FUTURE must be rejected with a field-specific error.
  const futureLastContactIso = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
  const futureContactRes = await executeUpdateLeadOperation({
    lead_id: updLeadId,
    crm_status: 'contacted',
    priority: 'medium',
    next_action_type: null,
    next_action_at: null,
    last_contact_at: futureLastContactIso,
    lost_reason: null,
    expected_version: 2,
  }, salesSessionWilliam);
  assert(futureContactRes.success === false && futureContactRes.error === 'VALIDATION_ERROR', 'Future last_contact_at rejected as VALIDATION_ERROR');
  assert(!!futureContactRes.fieldErrors && typeof futureContactRes.fieldErrors.last_contact_at === 'string', 'Future last_contact_at returns a field-specific error on last_contact_at');

  // 28. last_contact_at BEFORE the lead creation is allowed (contact happened before CRM registration).
  const wayBeforeCreationIso = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
  const beforeCreationRes = await executeUpdateLeadOperation({
    lead_id: updLeadId,
    crm_status: 'qualified',
    priority: 'high',
    next_action_type: null,
    next_action_at: null,
    last_contact_at: wayBeforeCreationIso,
    lost_reason: null,
    expected_version: 2,
  }, salesSessionWilliam);
  assert(beforeCreationRes.success === true, 'last_contact_at before lead creation is accepted');
  assert(beforeCreationRes.operation?.last_contact_at === wayBeforeCreationIso, 'Past (pre-creation) last_contact_at saved correctly');

  // 29. Notes (Hallazgo 2): the manual lead note is retrievable and exposes only safe fields.
  const opsRepoNotes = new MockOperationsRepository();
  const williamNotes = await opsRepoNotes.listNotes(updLeadId);
  // salesBLeadId (#25) was created without an initial note, so we add one to validate retrieval.
  await opsRepoNotes.createNote({ lead_id: updLeadId, body: 'Nota de seguimiento de QA.' }, 'william-ficticio@example.com');
  const williamNotesAfter = await opsRepoNotes.listNotes(updLeadId);
  assert(williamNotesAfter.length === williamNotes.length + 1, 'Note is stored and retrievable via listNotes for the manual lead');
  assert(williamNotesAfter[0]?.body === 'Nota de seguimiento de QA.', 'Newest note body is retrievable (newest-first ordering)');
  assert(williamNotesAfter[0]?.created_by === 'william-ficticio@example.com', 'Note exposes its author (created_by)');

  console.log('🎉 All Manual Leads MVP tests passed successfully!');
}

runTests().catch((err) => {
  console.error('❌ Tests failed with error:', err);
  process.exit(1);
});
