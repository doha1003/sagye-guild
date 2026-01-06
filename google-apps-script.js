/**
 * 사계 길드 - 아이온2 전투력 자동 갱신 스크립트
 *
 * 사용법:
 * 1. 구글 시트에서 확장 프로그램 → Apps Script
 * 2. 이 코드 전체 복사해서 붙여넣기
 * 3. 저장 (Ctrl+S)
 * 4. 시트로 돌아와서 새로고침
 * 5. 메뉴에 "사계 길드" 메뉴 생성됨
 * 6. "사계 길드" → "전투력 갱신" 클릭
 */

// 메뉴 생성
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('사계 길드')
    .addItem('전투력 갱신', 'updateAllCombatPower')
    .addItem('선택한 행만 갱신', 'updateSelectedRows')
    .addToUi();
}

// 설정
const CONFIG = {
  SERVER: '지켈',
  SERVER_ID: 2002,
  RACE: '마족',
  NICKNAME_COL: 2,    // B열 (캐릭터명)
  POWER_COL: 8,       // H열 (전투력) - 시트에 맞게 수정
  HEADER_ROW: 1,      // 헤더 행
};

// 전체 길드원 전투력 갱신
function updateAllCombatPower() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow <= CONFIG.HEADER_ROW) {
    SpreadsheetApp.getUi().alert('데이터가 없습니다.');
    return;
  }

  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    '전투력 갱신',
    `${lastRow - CONFIG.HEADER_ROW}명의 전투력을 갱신합니다.\n시간이 걸릴 수 있습니다. 계속할까요?`,
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  let updated = 0;
  let failed = 0;

  for (let row = CONFIG.HEADER_ROW + 1; row <= lastRow; row++) {
    const nickname = sheet.getRange(row, CONFIG.NICKNAME_COL).getValue();
    if (!nickname) continue;

    try {
      const data = fetchCharacterData(nickname);
      if (data && data.combat_power) {
        sheet.getRange(row, CONFIG.POWER_COL).setValue(data.combat_power);
        updated++;
      } else {
        failed++;
      }
    } catch (e) {
      console.log(`Error for ${nickname}: ${e.message}`);
      failed++;
    }

    // Rate limiting - 1초 대기
    Utilities.sleep(1000);
  }

  ui.alert('갱신 완료', `성공: ${updated}명\n실패: ${failed}명`, ui.ButtonSet.OK);
}

// 선택한 행만 갱신
function updateSelectedRows() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const selection = sheet.getActiveRange();
  const startRow = selection.getRow();
  const numRows = selection.getNumRows();

  if (startRow <= CONFIG.HEADER_ROW) {
    SpreadsheetApp.getUi().alert('헤더가 아닌 데이터 행을 선택하세요.');
    return;
  }

  let updated = 0;

  for (let i = 0; i < numRows; i++) {
    const row = startRow + i;
    const nickname = sheet.getRange(row, CONFIG.NICKNAME_COL).getValue();
    if (!nickname) continue;

    try {
      const data = fetchCharacterData(nickname);
      if (data && data.combat_power) {
        sheet.getRange(row, CONFIG.POWER_COL).setValue(data.combat_power);
        updated++;
      }
    } catch (e) {
      console.log(`Error for ${nickname}: ${e.message}`);
    }

    Utilities.sleep(1000);
  }

  SpreadsheetApp.getUi().alert(`${updated}명 갱신 완료`);
}

// aion2tool에서 캐릭터 데이터 가져오기
function fetchCharacterData(nickname) {
  const url = `https://www.aion2tool.com/api/character/search?nickname=${encodeURIComponent(nickname)}&server=${encodeURIComponent(CONFIG.SERVER)}&race=${encodeURIComponent(CONFIG.RACE)}`;

  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.aion2tool.com/',
      },
      muteHttpExceptions: true,
    });

    const code = response.getResponseCode();
    if (code !== 200) {
      console.log(`API returned ${code} for ${nickname}`);
      return null;
    }

    const json = JSON.parse(response.getContentText());

    // 응답 구조: { data: { combat_power, combat_score, ... } }
    if (json && json.data) {
      return {
        combat_power: json.data.combat_power,
        combat_score: json.data.combat_score,
        job: json.data.job,
        level: json.data.level,
      };
    }

    return null;
  } catch (e) {
    console.log(`Fetch error for ${nickname}: ${e.message}`);
    return null;
  }
}

// 테스트 함수 - 스크립트 에디터에서 실행해서 확인
function testFetch() {
  const result = fetchCharacterData('텐겐');
  console.log(result);
}
