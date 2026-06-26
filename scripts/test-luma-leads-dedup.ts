import * as fs from 'fs';
import * as path from 'path';
import {
  findLumaLeadV2Match,
  isDuplicateLumaLeadV2,
  V2_COLUMNS as GoogleSheetsV2Columns,
} from '../src/lib/google-sheets';
import {
  isValidEmail,
  isValidPhone,
  claimSubmissionIdentity,
  releaseSubmissionIdentity,
  pruneExpiredClaims,
  buildSubmissionClaimKeys,
  createSubmissionClaimStore,
  type SubmissionClaimStore,
} from '../src/lib/luma-leads-validation';
import { V2_COLUMNS as RepositoryV2Columns } from '../src/lib/crm/google-sheets-repository';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

console.log('Running Luma Leads V2 deduplication tests...');

async function runTests() {
  // ── A. Matching against Sheets rows (findLumaLeadV2Match) ──────────────────

  assert(findLumaLeadV2Match([], 'new@example.com', '+1 305 555 0001') === false, 'Empty existing rows: no match (first submission)');

  assert(
    findLumaLeadV2Match([['existing@example.com', '+1 305 555 9999']], 'existing@example.com', '+1 786 000 0000') === true,
    'Same email, different phone: matches'
  );

  assert(
    findLumaLeadV2Match([['other@example.com', '+1 305 555 0001']], 'different@example.com', '13055550001') === true,
    'Same phone digits, different email: matches'
  );

  assert(
    findLumaLeadV2Match([['Test@Example.com', '+1 305 555 0001']], 'test@example.com', '+1 999 999 9999') === true,
    'Email differing only by case: matches'
  );

  assert(
    findLumaLeadV2Match([['a@example.com', '+1 (305) 555-0001']], 'b@example.com', '1-305-555-0001') === true,
    'Phone with spaces/parens/dashes vs digits-only equivalent: matches'
  );

  assert(
    findLumaLeadV2Match([['a@example.com', '0052 55 1234 5678']], 'b@example.com', '+52 55 1234 5678') === true,
    'Phone with "00" international prefix vs "+": matches'
  );

  assert(
    findLumaLeadV2Match([['existing@example.com', '+1 305 555 9999']], 'new@example.com', '+1 786 000 0000') === false,
    'Different email and different phone: no match'
  );

  {
    const fakeRows = [['stored@example.com', '+1 305 555 0001']];
    const isDup = await isDuplicateLumaLeadV2('stored@example.com', '+1 999 999 9999', async () => fakeRows);
    assert(isDup === true, 'isDuplicateLumaLeadV2 delegates to findLumaLeadV2Match via injected fetchRows (match)');
  }

  {
    const isDupNone = await isDuplicateLumaLeadV2('nobody@example.com', '+1 000 000 0000', async () => []);
    assert(isDupNone === false, 'isDuplicateLumaLeadV2 returns false with injected empty rows (no match)');
  }

  // ── B. Field validation regression (reused from luma-leads-validation.ts) ──

  assert(isValidEmail('valid@example.com') === true, 'isValidEmail accepts a well-formed email');
  assert(isValidEmail('not-an-email') === false, 'isValidEmail rejects a string without @ or domain');
  assert(isValidPhone('+1 305 555 0001') === true, 'isValidPhone accepts a phone with 7-20 digits');
  assert(isValidPhone('123') === false, 'isValidPhone rejects a phone with too few digits');
  assert(isValidPhone('1'.repeat(25)) === false, 'isValidPhone rejects a phone with too many digits');

  // ── C. Submission claim guard (functional, deterministic — store + now injected) ──
  // The unit of storage/cleanup/eviction is a whole claim (email+phone pair),
  // never a lone key — these tests assert that invariant directly, not just
  // the public claim/release booleans.

  function assertNoOrphanedKeys(store: SubmissionClaimStore, label: string) {
    assert(store.keyIndex.size === store.claims.size * 2, `${label}: keyIndex has exactly 2 entries per claim (no orphans)`);
    for (const [claimId, claim] of store.claims) {
      assert(store.keyIndex.get(claim.emailKey) === claimId, `${label}: claim's emailKey indexes back to its own claimId`);
      assert(store.keyIndex.get(claim.phoneKey) === claimId, `${label}: claim's phoneKey indexes back to its own claimId`);
    }
  }

  {
    const store = createSubmissionClaimStore();
    const now = 1_000_000;
    const ttl = 20_000;

    const firstClaim = claimSubmissionIdentity(store, 'guard1@example.com', '+1 305 555 1001', now, ttl);
    assert(firstClaim === true, 'First claim for a new email/phone identity is allowed');
    assertNoOrphanedKeys(store, 'After first claim');

    const sameComboAgain = claimSubmissionIdentity(store, 'guard1@example.com', '+1 305 555 1001', now, ttl);
    assert(sameComboAgain === false, 'Same email+phone immediately after: blocked');

    const sameEmailDiffPhone = claimSubmissionIdentity(store, 'guard1@example.com', '+1 305 555 2002', now, ttl);
    assert(sameEmailDiffPhone === false, 'Same email, different phone, within TTL: blocked');

    const samePhoneDiffEmail = claimSubmissionIdentity(store, 'guard2@example.com', '+1 305 555 1001', now, ttl);
    assert(samePhoneDiffEmail === false, 'Same phone, different email, within TTL: blocked');

    const afterTtl = claimSubmissionIdentity(store, 'guard1@example.com', '+1 305 555 1001', now + ttl + 1, ttl);
    assert(afterTtl === true, 'Same identity allowed again after the TTL has elapsed (prune ran)');
    assertNoOrphanedKeys(store, 'After TTL re-claim');
  }

  {
    const store = createSubmissionClaimStore();
    const now = 2_000_000;
    const ttl = 20_000;

    const claimed = claimSubmissionIdentity(store, 'retry@example.com', '+1 305 555 3003', now, ttl);
    assert(claimed === true, 'Claim succeeds before simulating a downstream failure');

    const [emailKey, phoneKey] = buildSubmissionClaimKeys('retry@example.com', '+1 305 555 3003');
    releaseSubmissionIdentity(store, 'retry@example.com', '+1 305 555 3003');
    assert(store.keyIndex.has(emailKey) === false, 'releaseSubmissionIdentity removes the email key from the index');
    assert(store.keyIndex.has(phoneKey) === false, 'releaseSubmissionIdentity removes the phone key from the index');
    assert(store.claims.size === 0, 'releaseSubmissionIdentity removes the full claim record, not just one key');

    const retryClaim = claimSubmissionIdentity(store, 'retry@example.com', '+1 305 555 3003', now + 1, ttl);
    assert(retryClaim === true, 'Releasing after an error allows an immediate legitimate retry (no TTL wait)');
  }

  {
    const store = createSubmissionClaimStore();
    const now = 3_000_000;

    claimSubmissionIdentity(store, 'expired@example.com', '+1 305 555 4004', now, 1_000);
    claimSubmissionIdentity(store, 'active@example.com', '+1 305 555 5005', now, 50_000);

    const [expiredEmailKey, expiredPhoneKey] = buildSubmissionClaimKeys('expired@example.com', '+1 305 555 4004');
    const [activeEmailKey, activePhoneKey] = buildSubmissionClaimKeys('active@example.com', '+1 305 555 5005');

    pruneExpiredClaims(store, now + 5_000);

    assert(store.keyIndex.has(expiredEmailKey) === false, "pruneExpiredClaims removes the expired claim's email key");
    assert(store.keyIndex.has(expiredPhoneKey) === false, "pruneExpiredClaims removes the expired claim's phone key");
    assert(store.keyIndex.has(activeEmailKey) === true, "pruneExpiredClaims keeps the still-active claim's email key");
    assert(store.keyIndex.has(activePhoneKey) === true, "pruneExpiredClaims keeps the still-active claim's phone key");
    assertNoOrphanedKeys(store, 'After pruning expired claims');
  }

  {
    const store = createSubmissionClaimStore();
    const now = 4_000_000;
    const ttl = 20_000;
    const maxClaims = 3;

    const identities = Array.from({ length: 6 }, (_, i) => ({
      email: `bounded${i}@example.com`,
      phone: `+1 305 555 60${i.toString().padStart(2, '0')}`,
    }));

    for (const { email, phone } of identities) {
      claimSubmissionIdentity(store, email, phone, now, ttl, maxClaims);
      assert(store.claims.size <= maxClaims, `Claim store stays within the configured limit (${maxClaims} claims, measured by claims not keys) after claiming ${email}`);
      assertNoOrphanedKeys(store, `After claiming ${email}`);
    }

    const [evictedEmailKey, evictedPhoneKey] = buildSubmissionClaimKeys(identities[0]!.email, identities[0]!.phone);
    assert(store.keyIndex.has(evictedEmailKey) === false, 'Oldest claim eviction removes its email key entirely (not left orphaned)');
    assert(store.keyIndex.has(evictedPhoneKey) === false, 'Oldest claim eviction removes its phone key entirely (not left orphaned)');

    const lastIdentity = identities[identities.length - 1]!;
    const [survivingEmailKey, survivingPhoneKey] = buildSubmissionClaimKeys(lastIdentity.email, lastIdentity.phone);
    assert(store.keyIndex.has(survivingEmailKey) === true, 'Non-evicted claims keep their email key');
    assert(store.keyIndex.has(survivingPhoneKey) === true, 'Non-evicted claims keep their phone key');
  }

  {
    const email = 'plaintext-check@example.com';
    const phone = '+1 305 555 7007';
    const [emailKey, phoneKey] = buildSubmissionClaimKeys(email, phone);
    const phoneDigits = phone.replace(/\D/g, '');

    assert(!emailKey.includes('@') && !emailKey.includes(email), 'Email claim key does not contain the plaintext email');
    assert(!phoneKey.includes(phoneDigits), 'Phone claim key does not contain the plaintext phone digits');
    assert(/^email:[a-f0-9]{64}$/.test(emailKey), 'Email claim key matches the expected hashed format');
    assert(/^phone:[a-f0-9]{64}$/.test(phoneKey), 'Phone claim key matches the expected hashed format');
  }

  // ── D. Contract regression: A:AC headers, public response shape ────────────

  const EXPECTED_V2_HEADERS = [
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

  assert(GoogleSheetsV2Columns.length === 29, 'google-sheets.ts V2_COLUMNS has exactly 29 columns (A:AC)');
  assert(JSON.stringify(GoogleSheetsV2Columns) === JSON.stringify(EXPECTED_V2_HEADERS), 'google-sheets.ts V2_COLUMNS matches the expected literal header list');
  assert(JSON.stringify(RepositoryV2Columns) === JSON.stringify(EXPECTED_V2_HEADERS), 'google-sheets-repository.ts V2_COLUMNS matches the expected literal header list');
  assert(JSON.stringify(GoogleSheetsV2Columns) === JSON.stringify(RepositoryV2Columns), 'Both V2_COLUMNS copies (append-side and read-side) stay in sync');

  const routePath = path.join(__dirname, '../src/app/api/luma-leads/route.ts');
  const routeContent = fs.readFileSync(routePath, 'utf-8');

  const successCount = (routeContent.match(/success: true, message: 'Evaluación recibida\.'/g) || []).length;
  assert(successCount >= 3, 'route.ts returns the exact same success message for new, in-flight-duplicate, and sheet-duplicate cases');

  const jsonResponses = routeContent.match(/NextResponse\.json\(\{[^}]*\}\)/g) || [];
  assert(jsonResponses.length > 0, 'route.ts contains NextResponse.json(...) calls to inspect');
  for (const responseSnippet of jsonResponses) {
    assert(!/\bemail\s*:/.test(responseSnippet), `Public response does not echo "email": ${responseSnippet}`);
    assert(!/\bphone\s*:/.test(responseSnippet), `Public response does not echo "phone": ${responseSnippet}`);
    assert(!/\bexistingLeadId\s*:/.test(responseSnippet), `Public response does not echo "existingLeadId": ${responseSnippet}`);
    assert(!/\bduplicate\s*:/.test(responseSnippet), `Public response does not include a "duplicate" flag: ${responseSnippet}`);
  }

  assert(!routeContent.includes('function isValidEmail'), 'route.ts no longer defines isValidEmail locally (moved to luma-leads-validation.ts)');
  assert(!routeContent.includes('function isValidPhone'), 'route.ts no longer defines isValidPhone locally (moved to luma-leads-validation.ts)');

  console.log('🎉 All Luma Leads V2 deduplication tests passed successfully!');
}

runTests().catch((err) => {
  console.error('❌ Tests failed with error:', err);
  process.exit(1);
});
