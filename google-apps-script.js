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
    .addSeparator()
    .addItem('⏰ 자동 갱신 켜기 (1시간마다)', 'setupHourlyTrigger')
    .addItem('❌ 자동 갱신 끄기', 'removeTrigger')
    .addSeparator()
    .addItem('🔍 API 테스트 (텐겐)', 'testFetch')
    .addToUi();
}

// 설정 - 시트 컬럼에 맞게 수정하세요!
const CONFIG = {
  SERVER: '지켈',
  SERVER_ID: 2002,
  RACE: '마족',
  NICKNAME_COL: 2,    // B열 (캐릭터명)
  SCORE_COL: 7,       // G열 (전투점수)
  POWER_COL: 8,       // H열 (전투력)
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
      if (data) {
        // G열: 전투점수, H열: 전투력
        if (data.combat_score) {
          sheet.getRange(row, CONFIG.SCORE_COL).setValue(data.combat_score);
        }
        if (data.combat_power) {
          sheet.getRange(row, CONFIG.POWER_COL).setValue(data.combat_power);
        }
        if (data.combat_score || data.combat_power) {
          updated++;
        } else {
          failed++;
        }
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
      if (data) {
        if (data.combat_score) {
          sheet.getRange(row, CONFIG.SCORE_COL).setValue(data.combat_score);
        }
        if (data.combat_power) {
          sheet.getRange(row, CONFIG.POWER_COL).setValue(data.combat_power);
        }
        if (data.combat_score || data.combat_power) {
          updated++;
        }
      }
    } catch (e) {
      console.log(`Error for ${nickname}: ${e.message}`);
    }

    Utilities.sleep(1000);
  }

  SpreadsheetApp.getUi().alert(`${updated}명 갱신 완료`);
}

// aion2tool 웹페이지에서 캐릭터 데이터 스크래핑
function fetchCharacterData(nickname) {
  // 웹페이지 URL (API 대신 직접 페이지 접근)
  const url = `https://www.aion2tool.com/char/serverid=${CONFIG.SERVER_ID}/${encodeURIComponent(nickname)}`;

  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      muteHttpExceptions: true,
      followRedirects: true,
    });

    const code = response.getResponseCode();
    if (code !== 200) {
      console.log(`Page returned ${code} for ${nickname}`);
      return null;
    }

    const html = response.getContentText();

    // HTML에서 전투력 추출: id="result-combat-power"
    const powerMatch = html.match(/id="result-combat-power"[^>]*>([0-9,]+)</);
    const combat_power = powerMatch ? parseInt(powerMatch[1].replace(/,/g, '')) : null;

    // HTML에서 전투점수 추출: id="dps-score-value"
    const scoreMatch = html.match(/id="dps-score-value"[^>]*>([0-9,]+)</);
    const combat_score = scoreMatch ? parseInt(scoreMatch[1].replace(/,/g, '')) : null;

    if (combat_power || combat_score) {
      return {
        combat_power: combat_power,
        combat_score: combat_score,
      };
    }

    console.log(`No data found in HTML for ${nickname}`);
    return null;
  } catch (e) {
    console.log(`Fetch error for ${nickname}: ${e.message}`);
    return null;
  }
}

// 테스트 함수 - 스크립트 에디터에서 실행해서 확인
// Apps Script 에디터에서 이 함수를 선택하고 실행 버튼 누르면 됩니다
function testFetch() {
  const nickname = '텐겐'; // 테스트할 닉네임
  console.log(`=== ${nickname} 데이터 조회 테스트 ===`);

  const result = fetchCharacterData(nickname);

  if (result) {
    console.log('✅ 성공!');
    console.log('전투점수:', result.combat_score);
    console.log('전투력:', result.combat_power);
    console.log('직업:', result.job);
    console.log('레벨:', result.level);

    // UI로도 결과 표시
    SpreadsheetApp.getUi().alert(
      'API 테스트 성공!',
      `닉네임: ${nickname}\n전투점수: ${result.combat_score}\n전투력: ${result.combat_power}\n직업: ${result.job}`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } else {
    console.log('❌ 실패 - 데이터를 가져올 수 없습니다');
    SpreadsheetApp.getUi().alert(
      'API 테스트 실패',
      'aion2tool API에서 데이터를 가져올 수 없습니다.\nCloudflare 보호로 막혔을 수 있습니다.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

// ============================================
// 자동 트리거용 함수 (UI 없이 실행)
// ============================================

// 자동 갱신 (트리거용 - UI 알림 없음)
function autoUpdateCombatPower() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow <= CONFIG.HEADER_ROW) return;

  let updated = 0;
  let failed = 0;

  for (let row = CONFIG.HEADER_ROW + 1; row <= lastRow; row++) {
    const nickname = sheet.getRange(row, CONFIG.NICKNAME_COL).getValue();
    if (!nickname) continue;

    try {
      const data = fetchCharacterData(nickname);
      if (data) {
        if (data.combat_score) {
          sheet.getRange(row, CONFIG.SCORE_COL).setValue(data.combat_score);
        }
        if (data.combat_power) {
          sheet.getRange(row, CONFIG.POWER_COL).setValue(data.combat_power);
        }
        if (data.combat_score || data.combat_power) {
          updated++;
        } else {
          failed++;
        }
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

  console.log(`자동 갱신 완료 - 성공: ${updated}, 실패: ${failed}`);
}

// 트리거 설정 함수 (1시간마다 자동 실행)
function setupHourlyTrigger() {
  // 기존 트리거 삭제
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'autoUpdateCombatPower') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // 1시간마다 실행되는 트리거 생성
  ScriptApp.newTrigger('autoUpdateCombatPower')
    .timeBased()
    .everyHours(1)
    .create();

  SpreadsheetApp.getUi().alert('자동 갱신 트리거가 설정되었습니다.\n1시간마다 전투력이 자동으로 갱신됩니다.');
}

// 트리거 삭제 함수
function removeTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  let removed = 0;
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'autoUpdateCombatPower') {
      ScriptApp.deleteTrigger(trigger);
      removed++;
    }
  });

  SpreadsheetApp.getUi().alert(`${removed}개의 자동 갱신 트리거가 삭제되었습니다.`);
}
