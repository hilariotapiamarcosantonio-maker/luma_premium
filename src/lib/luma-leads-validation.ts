import { createHash } from 'node:crypto';

// ── Field validation (moved from the route handler so it stays a pure,
// reusable module — Next.js Route Handlers should only export the HTTP
// method handlers + runtime config). ───────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200;
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 20 && phone.length <= 30;
}

// ── Phone canonicalization for duplicate matching ───────────────────────────
// Treats a leading "00" international dialing prefix as equivalent to "+"
// before stripping to digits, so "+52 55..." and "0052 55..." compare equal.

export function canonicalizePhoneForMatch(phone: string): string {
  let cleaned = phone.trim();
  if (cleaned.startsWith('00')) {
    cleaned = `+${cleaned.slice(2)}`;
  }
  return cleaned.replace(/\D/g, '');
}

function hashIdentityValue(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function buildSubmissionClaimKeys(email: string, phone: string): [string, string] {
  const normalizedEmail = email.trim().toLowerCase();
  const canonicalPhone = canonicalizePhoneForMatch(phone);
  return [`email:${hashIdentityValue(normalizedEmail)}`, `phone:${hashIdentityValue(canonicalPhone)}`];
}

// ── Submission claim guard ───────────────────────────────────────────────────
// Short-lived, in-memory, same-instance defense against near-simultaneous
// duplicate submissions (e.g. double-click, client retry). Keys are sha256
// hashes — the normalized email/phone values themselves are never stored.
//
// The unit of storage, cleanup, and eviction is a whole claim (the
// email+phone pair), never a lone key — otherwise the claim limit could
// evict one half of a pair and leave the other active as an orphan.

interface SubmissionClaim {
  emailKey: string;
  phoneKey: string;
  expiry: number;
}

export interface SubmissionClaimStore {
  keyIndex: Map<string, string>; // emailKey/phoneKey -> claimId
  claims: Map<string, SubmissionClaim>; // claimId -> full claim
}

export function createSubmissionClaimStore(): SubmissionClaimStore {
  return { keyIndex: new Map(), claims: new Map() };
}

function deleteClaim(store: SubmissionClaimStore, claimId: string): void {
  const claim = store.claims.get(claimId);
  if (!claim) return;
  store.keyIndex.delete(claim.emailKey);
  store.keyIndex.delete(claim.phoneKey);
  store.claims.delete(claimId);
}

export function pruneExpiredClaims(store: SubmissionClaimStore, now: number): void {
  for (const [claimId, claim] of store.claims) {
    if (claim.expiry <= now) {
      deleteClaim(store, claimId);
    }
  }
}

const MAX_CLAIM_ENTRIES = 500;

function enforceClaimLimit(store: SubmissionClaimStore, maxClaims: number): void {
  while (store.claims.size > maxClaims) {
    const oldestClaimId = store.claims.keys().next().value;
    if (oldestClaimId === undefined) break;
    deleteClaim(store, oldestClaimId);
  }
}

export function claimSubmissionIdentity(
  store: SubmissionClaimStore,
  email: string,
  phone: string,
  now: number,
  ttlMs: number,
  maxClaims: number = MAX_CLAIM_ENTRIES
): boolean {
  pruneExpiredClaims(store, now);

  const [emailKey, phoneKey] = buildSubmissionClaimKeys(email, phone);
  if (store.keyIndex.has(emailKey) || store.keyIndex.has(phoneKey)) {
    return false;
  }

  // The claim's own emailKey doubles as its claimId: it is guaranteed unique
  // at creation time (the check above just confirmed it isn't active yet).
  const claimId = emailKey;
  store.claims.set(claimId, { emailKey, phoneKey, expiry: now + ttlMs });
  store.keyIndex.set(emailKey, claimId);
  store.keyIndex.set(phoneKey, claimId);
  enforceClaimLimit(store, maxClaims);
  return true;
}

export function releaseSubmissionIdentity(store: SubmissionClaimStore, email: string, phone: string): void {
  const [emailKey, phoneKey] = buildSubmissionClaimKeys(email, phone);
  // Look up the claimId via the index rather than assuming it equals
  // emailKey — keeps this function correct even if claimId generation changes.
  const claimId = store.keyIndex.get(emailKey) ?? store.keyIndex.get(phoneKey);
  if (claimId === undefined) return;
  deleteClaim(store, claimId);
}
