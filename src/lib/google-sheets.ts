import { google } from 'googleapis';

export async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

export async function appendLumaLead(data: string[]) {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.LUMA_LEADS_SPREADSHEET_ID;
    const sheetName = process.env.LUMA_LEADS_SHEET_NAME || 'Luma Estate Leads';

    if (!spreadsheetId) {
      throw new Error('LUMA_LEADS_SPREADSHEET_ID is not defined');
    }

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:J`, // Assuming 10 columns: Date, Name, Email, Operation, Volume, Channels, Ads, CRM, PainPoint, Budget
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [data],
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error appending lead to Google Sheets:', error);
    throw error;
  }
}