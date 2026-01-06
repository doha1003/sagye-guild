import { google } from 'googleapis';

// Google Sheets 인증 설정
const getAuth = () => {
  const credentials = {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
  };

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return auth;
};

export const sheets = () => {
  const auth = getAuth();
  return google.sheets({ version: 'v4', auth });
};

// 시트 ID
export const PETS_SHEET_ID = process.env.PETS_SHEET_ID || '';
export const APPEARANCE_SHEET_ID = process.env.APPEARANCE_SHEET_ID || '';

// 데이터 읽기
export async function readSheetData(spreadsheetId: string, range: string) {
  const sheetsApi = sheets();
  const response = await sheetsApi.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  return response.data.values || [];
}

// 데이터 쓰기 (전체 덮어쓰기)
export async function writeSheetData(spreadsheetId: string, range: string, values: string[][]) {
  const sheetsApi = sheets();
  await sheetsApi.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: { values },
  });
}

// 행 추가
export async function appendSheetData(spreadsheetId: string, range: string, values: string[][]) {
  const sheetsApi = sheets();
  await sheetsApi.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: { values },
  });
}

// 특정 행 업데이트
export async function updateSheetRow(spreadsheetId: string, range: string, values: string[]) {
  const sheetsApi = sheets();
  await sheetsApi.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: { values: [values] },
  });
}

// 행 삭제 (빈 값으로 덮어쓰기)
export async function clearSheetRow(spreadsheetId: string, range: string) {
  const sheetsApi = sheets();
  await sheetsApi.spreadsheets.values.clear({
    spreadsheetId,
    range,
  });
}
