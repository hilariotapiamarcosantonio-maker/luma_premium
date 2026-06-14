/**
 * Script para crear la pestaña "Luma Leads V2" en el Google Spreadsheet existente.
 *
 * Ejecutar SOLO UNA VEZ con credenciales reales configuradas en .env.local:
 *   node scripts/create-luma-leads-v2-sheet.mjs
 *
 * Prerrequisitos:
 *   - LUMA_LEADS_SPREADSHEET_ID configurado en .env.local con el ID real
 *   - GOOGLE_CLIENT_EMAIL y GOOGLE_PRIVATE_KEY configurados
 *   - LUMA_LEADS_SHEET_V2_NAME=Luma Leads V2 (o el nombre deseado)
 */

import { readFileSync } from 'fs';
import { google } from 'googleapis';

// ── Load .env.local manually (no dotenv dependency needed) ───────────────────
function loadEnv(path = '.env.local') {
  try {
    const raw = readFileSync(path, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
    console.log('✓ Loaded .env.local');
  } catch {
    console.warn('⚠ Could not read .env.local — using existing process.env');
  }
}

loadEnv();

// ── V2 column headers (must match V2_COLUMNS in google-sheets.ts) ────────────
const V2_HEADERS = [
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

const SPREADSHEET_ID = process.env.LUMA_LEADS_SPREADSHEET_ID;
const SHEET_V2_NAME  = process.env.LUMA_LEADS_SHEET_V2_NAME || 'Luma Leads V2';
const CLIENT_EMAIL   = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY    = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// ── Validations ───────────────────────────────────────────────────────────────
if (!SPREADSHEET_ID || SPREADSHEET_ID.includes('aqui')) {
  console.error('❌ LUMA_LEADS_SPREADSHEET_ID is not configured with a real spreadsheet ID.');
  console.error('   Update .env.local with your actual Google Sheets spreadsheet ID.');
  process.exit(1);
}
if (!CLIENT_EMAIL || !PRIVATE_KEY) {
  console.error('❌ Google credentials (GOOGLE_CLIENT_EMAIL / GOOGLE_PRIVATE_KEY) are missing.');
  process.exit(1);
}

console.log(`\n📊 Target spreadsheet: ${SPREADSHEET_ID.slice(0, 8)}...`);
console.log(`📋 Target sheet name: "${SHEET_V2_NAME}"`);
console.log(`📏 Column count: ${V2_HEADERS.length} (expected 29)\n`);

// ── Google auth ───────────────────────────────────────────────────────────────
const auth = new google.auth.GoogleAuth({
  credentials: { client_email: CLIENT_EMAIL, private_key: PRIVATE_KEY },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

async function run() {
  // 1. Get existing sheet list
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const existingSheets = meta.data.sheets?.map(s => s.properties?.title) ?? [];
  console.log('Existing sheets:', existingSheets.join(', '));

  // 2. Create sheet if it doesn't exist
  if (existingSheets.includes(SHEET_V2_NAME)) {
    console.log(`✓ Sheet "${SHEET_V2_NAME}" already exists — skipping creation.`);
  } else {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{
          addSheet: { properties: { title: SHEET_V2_NAME, gridProperties: { rowCount: 1000, columnCount: 32 } } }
        }]
      }
    });
    console.log(`✓ Created sheet "${SHEET_V2_NAME}".`);
  }

  // 3. Check if headers are already written
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_V2_NAME}!A1:AC1`,
  });
  const existingHeaders = existing.data.values?.[0] ?? [];

  if (existingHeaders.length === V2_HEADERS.length &&
      existingHeaders.every((h, i) => h === V2_HEADERS[i])) {
    console.log('✓ Headers already present and correct — nothing to do.');
    return;
  }

  // 4. Write headers
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_V2_NAME}!A1:AC1`,
    valueInputOption: 'RAW',
    requestBody: { values: [V2_HEADERS] },
  });
  console.log(`✓ Wrote ${V2_HEADERS.length} headers to row 1.`);

  // 5. Format header row (bold, frozen)
  const sheetId = meta.data.sheets?.find(s => s.properties?.title === SHEET_V2_NAME)?.properties?.sheetId;
  if (sheetId !== undefined) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
              cell: { userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.15, green: 0.15, blue: 0.2 } } },
              fields: 'userEnteredFormat(textFormat,backgroundColor)',
            }
          },
          {
            updateSheetProperties: {
              properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
              fields: 'gridProperties.frozenRowCount',
            }
          }
        ]
      }
    });
    console.log('✓ Applied bold + frozen header row formatting.');
  }

  console.log('\n🎉 Luma Leads V2 sheet is ready.');
  console.log('   Headers (A→AC):');
  V2_HEADERS.forEach((h, i) => {
    const col = String.fromCharCode(65 + (i < 26 ? i : 0)) + (i >= 26 ? String.fromCharCode(65 + i - 26) : '');
    console.log(`     ${col.padEnd(3)} ${h}`);
  });
}

run().catch(err => {
  console.error('\n❌ Script failed:', err.message);
  if (err.message?.includes('403')) console.error('   → Check that the service account has Editor access to the spreadsheet.');
  if (err.message?.includes('404')) console.error('   → Check that LUMA_LEADS_SPREADSHEET_ID is correct.');
  process.exit(1);
});
