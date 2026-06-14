import { google } from 'googleapis';

export async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

// V1 — Legacy: preserva leads inmobiliarios existentes en su hoja original.
export async function appendLumaLead(data: string[]) {
  const sheets = await getGoogleSheetsClient();
  const spreadsheetId = process.env.LUMA_LEADS_SPREADSHEET_ID;
  const sheetName = process.env.LUMA_LEADS_SHEET_NAME || 'Luma Estate Leads';

  if (!spreadsheetId) throw new Error('LUMA_LEADS_SPREADSHEET_ID is not defined');

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:J`,
    valueInputOption: 'RAW',
    requestBody: { values: [data] },
  });
  return response.data;
}

// V2 — Multinicho: esquema ampliado para el diagnóstico maestro.
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

const V2_COLUMNS: (keyof LumaLeadV2)[] = [
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

export async function appendLumaLeadV2(lead: Omit<LumaLeadV2, 'schema_version' | 'created_at' | 'status'>) {
  const sheets = await getGoogleSheetsClient();
  const spreadsheetId = process.env.LUMA_LEADS_SPREADSHEET_ID;
  const sheetName = process.env.LUMA_LEADS_SHEET_V2_NAME || 'Luma Leads V2';

  if (!spreadsheetId) throw new Error('LUMA_LEADS_SPREADSHEET_ID is not defined');

  const full: LumaLeadV2 = {
    schema_version: '2',
    created_at: new Date().toISOString(),
    status: 'nuevo',
    ...lead,
  };

  const row = V2_COLUMNS.map((col) => full[col] ?? '');

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:AC`,
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  });
  return response.data;
}
