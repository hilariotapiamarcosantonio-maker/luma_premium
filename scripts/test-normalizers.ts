import {
  fixUtf8Encoding,
  normalizeCountryCode,
  getCountryLabel,
  normalizeInvestmentRange,
  normalizeIndustry,
  normalizeAttribution,
  mapRowArrayToNormalizedFields
} from '../src/lib/crm/normalizers';
import { MockCrmRepository } from '../src/lib/crm/mock-repository';
import { GoogleSheetsCrmRepository, V2_COLUMNS as REAL_V2_COLUMNS } from '../src/lib/crm/google-sheets-repository';
import { MockOperationsRepository } from '../src/lib/crm/mock-operations-repository';
import { CrmLeadService } from '../src/lib/crm/crm-lead-service';
import { UpdateOperationSchema, CreateNoteSchema, ActorEmailSchema } from '../src/lib/crm/operations-schemas';
import { getCrmOperationsRepository } from '../src/lib/crm/operations-repository-factory';
import { ZodError } from 'zod';

const V2_COLUMNS = [
  'schema_version', 'created_at', 'locale', 'country',
  'full_name', 'email', 'phone', 'company', 'role',
  'industry', 'industry_detail', 'team_size', 'lead_volume',
  'acquisition_channels', 'advertising_status', 'current_tools',
  'main_bottleneck', 'desired_outcome', 'solution_interest',
  'timeline', 'investment_range',
  'source', 'page_origin',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'status',
];

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

console.log('Running normalizer tests...');

// 1. UTF-8 Corrections
assert(fixUtf8Encoding('Produccin') === 'Producción', 'UTF-8 Produccin');
assert(fixUtf8Encoding('Producci\uFFFDn') === 'Producción', 'UTF-8 Produccin');
assert(fixUtf8Encoding('Espaol') === 'Español', 'UTF-8 Espaol');
assert(fixUtf8Encoding('Espa\uFFFDol') === 'Español', 'UTF-8 Espaol');
assert(fixUtf8Encoding('S\uFFFD') === 'Sí', 'UTF-8 S');
assert(fixUtf8Encoding('Producción es correcta') === 'Producción es correcta', 'Valid text not modified');

// Intact values (US, US$, USA, USD, Sales, Servicios)
assert(fixUtf8Encoding('US') === 'US', 'US remains intact');
assert(fixUtf8Encoding('US$') === 'US$', 'US$ remains intact');
assert(fixUtf8Encoding('USA') === 'USA', 'USA remains intact');
assert(fixUtf8Encoding('USD') === 'USD', 'USD remains intact');
assert(fixUtf8Encoding('Sales') === 'Sales', 'Sales remains intact');
assert(fixUtf8Encoding('Servicios') === 'Servicios', 'Servicios remains intact');
assert(fixUtf8Encoding('S') === 'S', 'S remains intact'); // S normal does not change to Sí

// 2. Investment ranges
assert(normalizeInvestmentRange('US$1,000–3,000') === 'US$1,500–3,000', 'US$1,000–3,000 to US$1,500–3,000');
assert(normalizeInvestmentRange('US$1,000-3,000') === 'US$1,500–3,000', 'US$1,000-3,000 to US$1,500–3,000');
assert(normalizeInvestmentRange('1k–3k') === 'US$1,500–3,000', '1k–3k to US$1,500–3,000');
assert(normalizeInvestmentRange('1k-3k') === 'US$1,500–3,000', '1k-3k to US$1,500–3,000');
assert(normalizeInvestmentRange('Menos de US$1,500') === 'US$1,500–3,000', 'Menos de US$1,500 to US$1,500–3,000');
assert(normalizeInvestmentRange('1k–5k') === 'legacy_review', '1k–5k to legacy_review');
assert(normalizeInvestmentRange('1k-5k') === 'legacy_review', '1k-5k to legacy_review');
assert(normalizeInvestmentRange('US$5,000 - US$10,000') === 'US$5,000–10,000', '5k-10k range');

// 3. Industries
assert(normalizeIndustry('commerce') === 'Comercio y e-commerce', 'commerce industry normalization');
assert(normalizeIndustry('e-commerce') === 'Comercio y e-commerce', 'e-commerce industry normalization');
assert(normalizeIndustry('retail') === 'Comercio y e-commerce', 'retail industry normalization');
assert(normalizeIndustry('real estate') === 'Inmobiliarias y construcción', 'real estate industry normalization');
assert(normalizeIndustry('construcción') === 'Inmobiliarias y construcción', 'construcción industry normalization');
assert(normalizeIndustry('spa') === 'Belleza, spa y estética', 'spa industry normalization');
assert(normalizeIndustry('beauty') === 'Belleza, spa y estética', 'beauty industry normalization');
assert(normalizeIndustry('cosmetics') === 'Cosmética y cuidado personal', 'cosmetics industry normalization');
assert(normalizeIndustry('skincare') === 'Cosmética y cuidado personal', 'skincare industry normalization');
assert(normalizeIndustry('barbershop') === 'Peluquerías y barberías', 'barbershop industry normalization');
assert(normalizeIndustry('peluquería') === 'Peluquerías y barberías', 'peluquería industry normalization');
assert(normalizeIndustry('education') === 'Educación, academias y cursos', 'education industry normalization');
assert(normalizeIndustry('academia') === 'Educación, academias y cursos', 'academia industry normalization');
assert(normalizeIndustry('finance') === 'Finanzas, préstamos y seguros', 'finance industry normalization');
assert(normalizeIndustry('seguros') === 'Finanzas, préstamos y seguros', 'seguros industry normalization');
assert(normalizeIndustry('professional-services') === 'Servicios profesionales y B2B', 'professional-services industry normalization');
assert(normalizeIndustry('b2b') === 'Servicios profesionales y B2B', 'b2b industry normalization');
assert(normalizeIndustry('health') === 'Salud, bienestar y alto rendimiento', 'health industry normalization');
assert(normalizeIndustry('fitness') === 'Salud, bienestar y alto rendimiento', 'fitness industry normalization');
assert(normalizeIndustry('wellness') === 'Salud, bienestar y alto rendimiento', 'wellness industry normalization');
assert(normalizeIndustry('home') === 'Hogar, muebles y diseño de interiores', 'home industry normalization');
assert(normalizeIndustry('interiorismo') === 'Hogar, muebles y diseño de interiores', 'interiorismo industry normalization');
assert(normalizeIndustry('industry') === 'Industria, manufactura y minería', 'industry industry normalization');
assert(normalizeIndustry('minería') === 'Industria, manufactura y minería', 'minería industry normalization');
assert(normalizeIndustry('technology') === 'Tecnología, software y SaaS', 'technology industry normalization');
assert(normalizeIndustry('saas') === 'Tecnología, software y SaaS', 'saas industry normalization');
assert(normalizeIndustry('random') === 'Otros', 'unmatched industry maps to Otros');
assert(normalizeIndustry('') === 'Otros', 'empty industry maps to Otros');

// 4. Countries
assert(normalizeCountryCode('DO') === 'DO', 'Country code DO');
assert(normalizeCountryCode('Dominicana') === 'DO', 'Country name Dominicana');
assert(normalizeCountryCode('Estados Unidos') === 'US', 'Estados Unidos is normalized to US');
assert(getCountryLabel('DO') === 'República Dominicana', 'Country label DO');
assert(getCountryLabel('US') === 'Estados Unidos', 'Country label US');

// 5. Attribution
const attr1 = normalizeAttribution({ utm_source: 'facebook', utm_medium: 'cpc' });
assert(attr1.platform === 'meta' && attr1.channel === 'paid_social', 'facebook/cpc attribution');

const attr2 = normalizeAttribution({ utm_source: 'google', utm_medium: 'cpc' });
assert(attr2.platform === 'google' && attr2.channel === 'paid_search', 'google/cpc attribution');

const attr3 = normalizeAttribution({ utm_source: 'google', utm_medium: 'organic' });
assert(attr3.platform === 'google' && attr3.channel === 'organic_search', 'google/organic attribution');

const attr4 = normalizeAttribution({ utm_source: 'linkedin' });
assert(attr4.platform === 'linkedin' && attr4.channel === 'unknown', 'linkedin empty medium attribution');

const attr5 = normalizeAttribution({ page_origin: '/diagnostico' });
assert(attr5.platform === 'web' && attr5.channel === 'direct', 'page origin direct attribution');

// 6. Functional Filters (using simulated mock dataset and logic identical to the repository)
const testLeads = [
  { country: 'DO', platform: 'meta', channel: 'paid_social', investment_range: 'US$1,500–3,000' },
  { country: 'DO', platform: 'google', channel: 'organic_search', investment_range: 'US$1,500–3,000' },
  { country: 'US', platform: 'meta', channel: 'paid_social', investment_range: 'US$3,000–5,000' },
  { country: 'MX', platform: 'meta', channel: 'paid_social', investment_range: 'US$20,000+' },
];

function listLeadsSimulated(filters: { country?: string; platform?: string; channel?: string; investment_range?: string }) {
  let res = [...testLeads];
  if (filters.country) {
    res = res.filter((l) => l.country.toUpperCase() === filters.country!.toUpperCase());
  }
  if (filters.platform) {
    res = res.filter((l) => l.platform === filters.platform);
  }
  if (filters.channel) {
    res = res.filter((l) => l.channel === filters.channel);
  }
  if (filters.investment_range) {
    res = res.filter((l) => l.investment_range === filters.investment_range);
  }
  return res;
}

// Test 6.1: Country = DO filter returns DO and zero US
const doLeads = listLeadsSimulated({ country: 'DO' });
assert(doLeads.length === 2, 'DO filter returns correct count');
assert(!doLeads.some(l => l.country === 'US'), 'DO filter returns zero US leads');

// Test 6.2: Platform filter
const metaLeads = listLeadsSimulated({ platform: 'meta' });
assert(metaLeads.every(l => l.platform === 'meta'), 'Platform filter returns only Meta leads');

// Test 6.3: Channel filter
const organicLeads = listLeadsSimulated({ channel: 'organic_search' });
assert(organicLeads.every(l => l.channel === 'organic_search'), 'Channel filter returns only organic_search leads');

// Test 6.4: Budget filter
const budgetLeads = listLeadsSimulated({ investment_range: 'US$1,500–3,000' });
assert(budgetLeads.every(l => l.investment_range === 'US$1,500–3,000'), 'Budget filter returns only US$1,500–3,000 leads');

// Test 6.5: Combination (country + platform + budget)
const combinedLeads = listLeadsSimulated({
  country: 'MX',
  platform: 'meta',
  investment_range: 'US$20,000+'
});
assert(combinedLeads.length === 1 && combinedLeads[0].country === 'MX' && combinedLeads[0].platform === 'meta', 'Combined filter works perfectly');

// 7. Repository Mapping Test (mapRowArrayToNormalizedFields)
const mockRow: string[] = [];
V2_COLUMNS.forEach((colName) => {
  if (colName === 'industry') {
    mockRow.push('Producci\uFFFDn');
  } else if (colName === 'investment_range') {
    mockRow.push('US$1,000–3,000');
  } else if (colName === 'utm_source') {
    mockRow.push('facebook');
  } else if (colName === 'country') {
    mockRow.push('DO');
  } else if (colName === 'created_at') {
    mockRow.push('2026-06-15T12:00:00Z');
  } else if (colName === 'locale') {
    mockRow.push('es');
  } else if (colName === 'schema_version') {
    mockRow.push('2');
  } else {
    mockRow.push('');
  }
});

const mappedFields = mapRowArrayToNormalizedFields(mockRow, V2_COLUMNS as string[]);
assert(mappedFields !== null, 'Mapped fields should not be null');
if (mappedFields) {
  // Verificación de raw vs normalizado / visual
  assert(mappedFields.raw_industry === 'Producci\uFFFDn', 'Preserves raw industry exact spelling');
  assert(mappedFields.industry === 'Industria, manufactura y minería', 'Normalizes industry to Industria, manufactura y minería');

  assert(mappedFields.raw_investment_range === 'US$1,000–3,000', 'Preserves raw investment range exact spelling');
  assert(mappedFields.investment_range === 'US$1,500–3,000', 'Normalizes investment range to official range');

  assert(mappedFields.raw_utm_source === 'facebook', 'Preserves raw utm_source');
  assert(mappedFields.platform === 'meta', 'Normalizes facebook utm_source to meta platform');

  assert(mappedFields.raw_country === 'DO', 'Preserves raw country');
  assert(mappedFields.country === 'DO', 'Normalizes country code');
  assert(getCountryLabel(mappedFields.country) === 'República Dominicana', 'Translates country label to Spanish');
}

// 8. Repository Integration Tests
console.log('Running repository integration tests...');

async function runRepoTests() {
  // 8.1 MockCrmRepository test
  const mockRepo = new MockCrmRepository();
  const mockLeadsResult = await mockRepo.listLeads({ page_size: 100 });
  const testNormalizationLead = mockLeadsResult.leads.find(
    (l) => l.email === 'normalizacion@test.com'
  );

  assert(testNormalizationLead !== undefined, 'MockCrmRepository successfully loaded and mapped our dedicated test lead');
  if (testNormalizationLead) {
    // Assert raw values are preserved exactly (Rule 1)
    assert(testNormalizationLead.raw_industry === 'Producci\uFFFDn', 'MockCrmRepository preserves raw_industry');
    assert(testNormalizationLead.raw_investment_range === 'US$1,000–3,000', 'MockCrmRepository preserves raw_investment_range');
    assert(testNormalizationLead.raw_utm_source === 'facebook', 'MockCrmRepository preserves raw_utm_source');
    assert(testNormalizationLead.raw_country === 'DO', 'MockCrmRepository preserves raw_country');

    // Assert normalized / visual values (Rule 2)
    assert(testNormalizationLead.industry === 'Industria, manufactura y minería', 'MockCrmRepository normalized industry to Industria, manufactura y minería');
    assert(testNormalizationLead.investment_range === 'US$1,500–3,000', 'MockCrmRepository normalized investment_range to US$1,500–3,000');
    assert(testNormalizationLead.platform === 'meta', 'MockCrmRepository normalized utm_source facebook to platform meta');
    assert(testNormalizationLead.country === 'DO', 'MockCrmRepository normalized country to DO');
    assert(getCountryLabel(testNormalizationLead.country) === 'República Dominicana', 'MockCrmRepository translates country code to label');
  }

  // 8.2 GoogleSheetsCrmRepository mapping test
  // Verifying GoogleSheetsCrmRepository schema mapping logic (V2_COLUMNS must match REAL_V2_COLUMNS)
  assert(REAL_V2_COLUMNS.length === V2_COLUMNS.length, 'GoogleSheetsCrmRepository V2_COLUMNS length matches test V2_COLUMNS');
  for (let i = 0; i < V2_COLUMNS.length; i++) {
    assert(REAL_V2_COLUMNS[i] === V2_COLUMNS[i], `GoogleSheetsCrmRepository column ${i} (${REAL_V2_COLUMNS[i]}) matches test schema`);
  }

  console.log('🎉 All repository integration mapping tests passed successfully!');
}

async function runOperationsTests() {
  console.log('Running Operational CRM Subfase 2.0 tests...');

  // Test 1: Isolation & Default Values
  MockOperationsRepository.reset();
  const mockRepo = new MockCrmRepository();
  const mockOpsRepo = new MockOperationsRepository();
  const leadService = new CrmLeadService(mockRepo, mockOpsRepo);

  const testLeadEmail = 'alejandro@proptech-es.com';
  const leadsResult = await mockRepo.listLeads({ page_size: 100 });
  const lead = leadsResult.leads.find((l) => l.email === testLeadEmail);
  assert(lead !== undefined, 'Target lead exists in capture mock repository');

  if (lead) {
    const merged = await leadService.getLeadById(lead.id);
    assert(merged !== null, 'Lead composition works');
    assert(merged?.crm_status === 'new', 'Lead without operation defaults to crm_status=new');
    assert(merged?.owner_email === null, 'Lead without operation has null owner by default');
  }

  // Test 2: Validation & Email normalization
  {
    const parsedUpdate = UpdateOperationSchema.parse({
      lead_id: 'lp_123456789012345678901234',
      crm_status: 'qualified',
      owner_email: 'WILLIAM@LUMAPREMIUM.COM ',
      priority: 'high',
      expected_version: 1,
    });
    assert(parsedUpdate.owner_email === 'william@lumapremium.com', 'owner_email normalized to lowercase and trimmed');

    const normalizedActor = ActorEmailSchema.parse('ADMIN@LUMAPREMIUM.COM ');
    assert(normalizedActor === 'admin@lumapremium.com', 'actorEmail normalized to lowercase and trimmed');
  }

  // Test 3: lost_reason validation
  {
    // 3.1: lost_reason sin crm_status → rechazo
    let threwLostReasonWithoutStatus = false;
    try {
      UpdateOperationSchema.parse({
        lead_id: 'lp_123456789012345678901234',
        lost_reason: 'Presupuesto insuficiente',
        expected_version: 1,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        threwLostReasonWithoutStatus = true;
      }
    }
    assert(threwLostReasonWithoutStatus, 'lost_reason sin crm_status → rechazo');

    // 3.2: lost_reason con status no-lost → rechazo
    let threwLostReasonWithOtherStatus = false;
    try {
      UpdateOperationSchema.parse({
        lead_id: 'lp_123456789012345678901234',
        crm_status: 'negotiation',
        lost_reason: 'Presupuesto insuficiente',
        expected_version: 1,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        threwLostReasonWithOtherStatus = true;
      }
    }
    assert(threwLostReasonWithOtherStatus, 'lost_reason con status no-lost → rechazo');

    // 3.3: status lost sin lost_reason → rechazo
    let threwLostWithoutLostReason = false;
    try {
      UpdateOperationSchema.parse({
        lead_id: 'lp_123456789012345678901234',
        crm_status: 'lost',
        expected_version: 1,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        threwLostWithoutLostReason = true;
      }
    }
    assert(threwLostWithoutLostReason, 'status lost sin lost_reason → rechazo');

    // 3.4: status lost con lost_reason → válido
    const parsedLost = UpdateOperationSchema.parse({
      lead_id: 'lp_123456789012345678901234',
      crm_status: 'lost',
      lost_reason: 'Presupuesto insuficiente',
      expected_version: 1,
    });
    assert(parsedLost.lost_reason === 'Presupuesto insuficiente', 'status lost con lost_reason → válido');
  }

  // Test 4: Note validation lengths & space trims
  {
    let noteTooShort = false;
    try {
      CreateNoteSchema.parse({
        lead_id: 'lp_123456789012345678901234',
        body: '',
      });
    } catch (err) {
      noteTooShort = true;
    }
    assert(noteTooShort, 'Note body cannot be empty');

    let noteWithSpacesOnly = false;
    try {
      CreateNoteSchema.parse({
        lead_id: 'lp_123456789012345678901234',
        body: '      ',
      });
    } catch (err) {
      noteWithSpacesOnly = true;
    }
    assert(noteWithSpacesOnly, 'Note body with spaces only must fail validation');

    let noteTooLong = false;
    try {
      CreateNoteSchema.parse({
        lead_id: 'lp_123456789012345678901234',
        body: 'a'.repeat(2001),
      });
    } catch (err) {
      noteTooLong = true;
    }
    assert(noteTooLong, 'Note body cannot exceed 2000 characters');
  }

  // Test 5: Concurrency check & Updates
  MockOperationsRepository.reset();
  if (lead) {
    // 5.1: Create first operations record
    const createdOp = await mockOpsRepo.upsertOperation({
      lead_id: lead.id,
      crm_status: 'contacted',
      owner_email: 'blaancoperla@gmail.com',
      priority: 'high',
      expected_version: 1,
    }, 'marcos@example.com');
    assert(createdOp.version === 1, 'New operation starts at version 1');
    assert(createdOp.updated_by === 'marcos@example.com', 'updated_by assigned from actorEmail');

    // 5.2: Update with correct version
    const updatedOp = await mockOpsRepo.upsertOperation({
      lead_id: lead.id,
      crm_status: 'qualified',
      expected_version: 1,
    }, 'marcos@example.com');
    assert(updatedOp.version === 2, 'Successful update increments version to 2');

    // 5.3: Update with incorrect version (should fail)
    let threwConcurrency = false;
    try {
      await mockOpsRepo.upsertOperation({
        lead_id: lead.id,
        crm_status: 'proposal_sent',
        expected_version: 1, // expected 2
      }, 'marcos@example.com');
    } catch (err: unknown) {
      if ((err as Error).message === 'CONCURRENCY_ERROR') {
        threwConcurrency = true;
      }
    }
    assert(threwConcurrency, 'Update fails with CONCURRENCY_ERROR if expected_version is wrong');
  }

  // Test 6: Notes order (Newest first)
  MockOperationsRepository.reset();
  if (lead) {
    // Make sure we have the operations record first
    await mockOpsRepo.upsertOperation({
      lead_id: lead.id,
      crm_status: 'new',
      expected_version: 1,
    }, 'marcos@example.com');

    await mockOpsRepo.createNote({
      lead_id: lead.id,
      body: 'Nota antigua',
    }, 'blaancoperla@gmail.com');

    await new Promise((resolve) => setTimeout(resolve, 10));

    await mockOpsRepo.createNote({
      lead_id: lead.id,
      body: 'Nota nueva',
    }, 'blaancoperla@gmail.com');

    const notes = await mockOpsRepo.listNotes(lead.id);
    assert(notes.length === 2, 'Two notes created successfully');
    assert(notes[0].body === 'Nota nueva', 'Notes are sorted: newest first');
    assert(notes[1].body === 'Nota antigua', 'Notes are sorted: oldest last');
  }

  // Test 7: Isolation verification
  MockOperationsRepository.reset();
  if (lead) {
    const operation = await mockOpsRepo.getOperationByLeadId(lead.id);
    assert(operation === null, 'Mock repository is completely isolated and resets cleanly');
  }

  // Test 8: Prevent Mock accidental in Production
  {
    const originalEnv = process.env.CRM_OPERATIONS_MODE;
    const originalNodeEnv = process.env.NODE_ENV;

    try {
      // 8.1 Mode 'sheets' checks configuration
      process.env.CRM_OPERATIONS_MODE = 'sheets';
      const originalOpsId = process.env.LUMA_CRM_OPS_SPREADSHEET_ID;
      delete process.env.LUMA_CRM_OPS_SPREADSHEET_ID;

      let threwConfigError = false;
      try {
        await getCrmOperationsRepository();
      } catch (err: unknown) {
        if ((err as Error).message.includes('LUMA_CRM_OPS_SPREADSHEET_ID')) {
          threwConfigError = true;
        }
      }
      assert(threwConfigError, 'getCrmOperationsRepository throws config error in sheets mode if spreadsheet ID is missing');

      // If configured, should load successfully
      process.env.LUMA_CRM_OPS_SPREADSHEET_ID = 'test-id';
      const repoSheets = await getCrmOperationsRepository();
      assert(repoSheets !== null, 'getCrmOperationsRepository returns repository when sheets mode is properly configured');

      // Restore ID
      process.env.LUMA_CRM_OPS_SPREADSHEET_ID = originalOpsId;

      // 8.2 Mode 'mock' returns MockOperationsRepository
      process.env.CRM_OPERATIONS_MODE = 'mock';
      const repoMock = await getCrmOperationsRepository();
      assert(repoMock instanceof MockOperationsRepository, 'getCrmOperationsRepository returns MockOperationsRepository for mock mode');

      // 8.3 In development/test, empty mode returns MockOperationsRepository
      process.env.CRM_OPERATIONS_MODE = '';
      (process.env as Record<string, string | undefined>).NODE_ENV = 'test';
      const repoDev = await getCrmOperationsRepository();
      assert(repoDev instanceof MockOperationsRepository, 'getCrmOperationsRepository returns MockOperationsRepository in dev/test for empty mode');

      // 8.4 In production, empty mode throws an error
      process.env.CRM_OPERATIONS_MODE = '';
      (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
      let threwProd = false;
      try {
        await getCrmOperationsRepository();
      } catch (err: unknown) {
        if ((err as Error).message.includes('CRM_OPERATIONS_MODE must be explicitly configured')) {
          threwProd = true;
        }
      }
      assert(threwProd, 'getCrmOperationsRepository throws in production for empty mode');

      // 8.5 Invalid mode throws explicitly
      process.env.CRM_OPERATIONS_MODE = 'invalid-mode';
      (process.env as Record<string, string | undefined>).NODE_ENV = 'test';
      let threwInvalid = false;
      try {
        await getCrmOperationsRepository();
      } catch (err: unknown) {
        if ((err as Error).message.includes('Invalid CRM_OPERATIONS_MODE')) {
          threwInvalid = true;
        }
      }
      assert(threwInvalid, 'getCrmOperationsRepository throws for invalid mode');
    } finally {
      // Restore env
      process.env.CRM_OPERATIONS_MODE = originalEnv;
      (process.env as Record<string, string | undefined>).NODE_ENV = originalNodeEnv;
    }
  }

  // Test 9: Immutability / Cloning of Returned Mock Objects
  MockOperationsRepository.reset();
  if (lead) {
    const originalOp = await mockOpsRepo.upsertOperation({
      lead_id: lead.id,
      crm_status: 'contacted',
      owner_email: 'blaancoperla@gmail.com',
      priority: 'high',
      expected_version: 1,
    }, 'marcos@example.com');

    // Attempt to mutate the returned reference
    originalOp.priority = 'low';
    originalOp.owner_email = 'hacked@example.com';

    // Retrieve again from repository
    const fetchedOp = await mockOpsRepo.getOperationByLeadId(lead.id);
    assert(fetchedOp !== null, 'Operation exists');
    if (fetchedOp) {
      assert(fetchedOp.priority === 'high', 'Repository return value is immutable (cloned) - priority remains high');
      assert(fetchedOp.owner_email === 'blaancoperla@gmail.com', 'Repository return value is immutable (cloned) - owner remains blaancoperla@gmail.com');
    }

    // Mutate returned list elements
    const list = await mockOpsRepo.listOperations({ crm_status: 'contacted' });
    assert(list.length === 1, 'Operation is listed');
    list[0].crm_status = 'won';

    const fetchedAgain = await mockOpsRepo.getOperationByLeadId(lead.id);
    assert(fetchedAgain?.crm_status === 'contacted', 'Repository returned list is immutable (cloned) - status remains contacted');
  }

  // Test 10: Owner Filter Normalization (capitalization and spaces)
  MockOperationsRepository.reset();
  if (lead) {
    await mockOpsRepo.upsertOperation({
      lead_id: lead.id,
      crm_status: 'qualified',
      owner_email: 'blaancoperla@gmail.com',
      priority: 'high',
      expected_version: 1,
    }, 'marcos@example.com');

    // Search using filter with capitalization and spaces
    const found = await mockOpsRepo.listOperations({
      owner_email: '   BLAANCOPERLA@GMAIL.COM   '
    });
    assert(found.length === 1, 'listOperations finds owner with leading/trailing spaces and uppercase');
    assert(found[0].lead_id === lead.id, 'Found correct lead ID');

    // Search using filter with non-matching email
    const notFound = await mockOpsRepo.listOperations({
      owner_email: 'different@example.com'
    });
    assert(notFound.length === 0, 'listOperations does not find operations for non-matching owner');
  }

  // Test 11: Env variable restoration verification
  {
    const originalEnv = process.env.CRM_OPERATIONS_MODE;
    const originalNodeEnv = process.env.NODE_ENV;

    // Simulate failure inside env change block
    let threwAndRestored = false;
    try {
      try {
        process.env.CRM_OPERATIONS_MODE = 'sheets';
        (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
        throw new Error('SIMULATED_FAIL');
      } finally {
        process.env.CRM_OPERATIONS_MODE = originalEnv;
        (process.env as Record<string, string | undefined>).NODE_ENV = originalNodeEnv;
      }
    } catch (err: unknown) {
      if ((err as Error).message === 'SIMULATED_FAIL') {
        threwAndRestored = true;
      }
    }

    assert(threwAndRestored, 'Simulated failure inside env block caught successfully');
    assert(process.env.CRM_OPERATIONS_MODE === originalEnv, 'CRM_OPERATIONS_MODE restored after failure');
    assert(process.env.NODE_ENV === originalNodeEnv, 'NODE_ENV restored after failure');
  }

  console.log('🎉 All Operational CRM Subfase 2.0 tests passed successfully!');
}

async function runAuthTests() {
  console.log('Running Auth authorized-users tests...');
  const { normalizeEnvEmails, getAuthorizedUser } = await import('../src/lib/auth/authorized-users');

  // 1. Un solo correo
  {
    const emails = normalizeEnvEmails('admin@example.com');
    assert(emails.size === 1, 'Un solo correo: size');
    assert(emails.has('admin@example.com'), 'Un solo correo: content');
  }

  // 2. Correos separados por coma
  {
    const emails = normalizeEnvEmails('admin1@example.com,admin2@example.com');
    assert(emails.size === 2, 'Correos separados por coma: size');
    assert(emails.has('admin1@example.com') && emails.has('admin2@example.com'), 'Correos separados por coma: content');
  }

  // 3. Espacios alrededor
  {
    const emails = normalizeEnvEmails('  admin1@example.com  ,  admin2@example.com  ');
    assert(emails.size === 2, 'Espacios alrededor: size');
    assert(emails.has('admin1@example.com') && emails.has('admin2@example.com'), 'Espacios alrededor: content');
  }

  // 4. Valor completo rodeado por comillas
  {
    const emails = normalizeEnvEmails('"admin1@example.com,admin2@example.com"');
    assert(emails.size === 2, 'Valor completo rodeado por comillas: size');
    assert(emails.has('admin1@example.com') && emails.has('admin2@example.com'), 'Valor completo rodeado por comillas: content');
  }

  // 5. Cada correo rodeado por comillas
  {
    const emails = normalizeEnvEmails('"admin1@example.com","admin2@example.com"');
    assert(emails.size === 2, 'Cada correo rodeado por comillas: size');
    assert(emails.has('admin1@example.com') && emails.has('admin2@example.com'), 'Cada correo rodeado por comillas: content');
  }

  // 6. Mayúsculas/minúsculas
  {
    const emails = normalizeEnvEmails('Admin1@Example.com,ADMIN2@example.com');
    assert(emails.size === 2, 'Mayúsculas/minúsculas: size');
    assert(emails.has('admin1@example.com') && emails.has('admin2@example.com'), 'Mayúsculas/minúsculas: content');
  }

  // 7. Entradas vacías
  {
    const emails = normalizeEnvEmails('admin1@example.com,,admin2@example.com, ,');
    assert(emails.size === 2, 'Entradas vacías: size');
    assert(emails.has('admin1@example.com') && emails.has('admin2@example.com'), 'Entradas vacías: content');
  }

  // 8. Correos duplicados
  {
    const emails = normalizeEnvEmails('admin1@example.com,admin1@example.com,admin2@example.com');
    assert(emails.size === 2, 'Correos duplicados: size');
    assert(emails.has('admin1@example.com') && emails.has('admin2@example.com'), 'Correos duplicados: content');
  }

  // 9. marcoshilario@lumapremium.com resuelve como Admin
  {
    const originalAdminEnv = process.env.CRM_ADMIN_EMAILS;
    const originalSalesEnv = process.env.CRM_SALES_EMAILS;

    try {
      process.env.CRM_ADMIN_EMAILS = '"marcoshilario@lumapremium.com,admin2@example.com"';
      process.env.CRM_SALES_EMAILS = 'sales@example.com';

      const user = getAuthorizedUser('marcoshilario@lumapremium.com');
      assert(user !== null, 'marcoshilario@lumapremium.com is authorized');
      assert(user?.role === 'admin', 'marcoshilario@lumapremium.com is Admin');

      // 10. Un correo no autorizado continúa siendo rechazado
      const rejectedUser = getAuthorizedUser('notauthorized@example.com');
      assert(rejectedUser === null, 'Un correo no autorizado continúa siendo rechazado');
    } finally {
      process.env.CRM_ADMIN_EMAILS = originalAdminEnv;
      process.env.CRM_SALES_EMAILS = originalSalesEnv;
    }
  }

  console.log('🎉 All Auth authorized-users tests passed successfully!');
}

async function runAll() {
  await runRepoTests();
  await runOperationsTests();
  await runAuthTests();
}

runAll().catch((err) => {
  console.error('❌ Tests failed:', err);
  process.exit(1);
});

export {};
