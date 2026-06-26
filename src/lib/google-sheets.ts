/**
 * Google Sheets integration — authenticated via Vercel OIDC.
 * Server-only. Never import from client components.
 */
import 'server-only';

import { google } from 'googleapis';
import { getGcpSheetsAuthClient, GcpConfigError, OidcTokenError, classifyGcpFailure } from './google-auth';
import type { GcpFailure } from './google-auth';
import { canonicalizePhoneForMatch } from './luma-leads-validation';

// ── Sheets client factory ─────────────────────────────────────────────────────

async function getSheetsClient() {
  const auth = await getGcpSheetsAuthClient();
  return google.sheets({ version: 'v4', auth });
}

// ── V1: legacy real-estate leads (backward compatible) ───────────────────────

export async function appendLumaLead(data: string[]) {
  const spreadsheetId = process.env.LUMA_LEADS_SPREADSHEET_ID;
  const sheetName     = process.env.LUMA_LEADS_SHEET_NAME || 'Luma Leads V1';

  if (!spreadsheetId) throw new GcpConfigError(['LUMA_LEADS_SPREADSHEET_ID']);

  const sheets = await getSheetsClient();
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:J`,
    valueInputOption: 'RAW',
    requestBody: { values: [data] },
  });
  return response.data;
}

// ── V2: multi-industry leads ──────────────────────────────────────────────────

export interface LumaLeadV2 {
  schema_version: string;
  created_at: string;
  locale: string;
  country: string;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  industry: string;
  industry_detail: string;
  team_size: string;
  lead_volume: string;
  acquisition_channels: string;
  advertising_status: string;
  current_tools: string;
  main_bottleneck: string;
  desired_outcome: string;
  solution_interest: string;
  timeline: string;
  investment_range: string;
  source: string;
  page_origin: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  status: string;
}

// Column order must match the sheet headers exactly (A → AC, 29 columns).
export const V2_COLUMNS: (keyof LumaLeadV2)[] = [
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

export async function appendLumaLeadV2(
  lead: Omit<LumaLeadV2, 'schema_version' | 'created_at' | 'status'>
) {
  const spreadsheetId = process.env.LUMA_LEADS_SPREADSHEET_ID;
  const sheetName     = process.env.LUMA_LEADS_SHEET_V2_NAME || 'Luma Leads V2';

  if (!spreadsheetId) throw new GcpConfigError(['LUMA_LEADS_SPREADSHEET_ID']);

  const full: LumaLeadV2 = {
    schema_version: '2',
    created_at: new Date().toISOString(),
    status: 'nuevo',
    ...lead,
  };

  const row = V2_COLUMNS.map((col) => full[col] ?? '');

  const sheets = await getSheetsClient();
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:AC`,
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  });
  return response.data;
}

// ── V2: duplicate detection ────────────────────────────────────────────────
// Reads only the email/phone columns (F:G) — never the full 29-column row —
// to decide whether a submission matches an existing lead by email or phone.

function canonicalizeEmailForMatch(email: string): string {
  return email.trim().toLowerCase();
}

export function findLumaLeadV2Match(rows: string[][], email: string, phone: string): boolean {
  const targetEmail = canonicalizeEmailForMatch(email);
  const targetPhone = canonicalizePhoneForMatch(phone);

  for (const row of rows) {
    const rowEmail = canonicalizeEmailForMatch(row[0] ?? '');
    const rowPhone = canonicalizePhoneForMatch(row[1] ?? '');
    if (targetEmail && rowEmail === targetEmail) return true;
    if (targetPhone && rowPhone === targetPhone) return true;
  }
  return false;
}

async function fetchExistingEmailPhoneRows(): Promise<string[][]> {
  const spreadsheetId = process.env.LUMA_LEADS_SPREADSHEET_ID;
  const sheetName     = process.env.LUMA_LEADS_SHEET_V2_NAME || 'Luma Leads V2';

  if (!spreadsheetId) throw new GcpConfigError(['LUMA_LEADS_SPREADSHEET_ID']);

  const sheets = await getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!F2:G`,
  });
  return response.data.values || [];
}

export async function isDuplicateLumaLeadV2(
  email: string,
  phone: string,
  fetchRows: () => Promise<string[][]> = fetchExistingEmailPhoneRows
): Promise<boolean> {
  const rows = await fetchRows();
  return findLumaLeadV2Match(rows, email, phone);
}

// Re-export error classes and the failure classifier so the API route can
// distinguish failure modes without importing the auth module directly.
export { GcpConfigError, OidcTokenError, classifyGcpFailure };
export type { GcpFailure };
