/**
 * 사계 레기온 - 아툴 데이터 자동 수집
 *
 * 결과: 구글 시트에 자동 업데이트
 */

const { chromium } = require('playwright');

const CONFIG = {
  SERVER_ID: 2002,
  SHEET_ID: '1wbEUQNy9ShybtKkZRlUAsr-CcyY5LDRYOxWL6a0dMTo',
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzfog5o5XS2CIYehbSdHrfAjgMerheTBDP6_ItxQGmQkdL4WeJaRUpXMwfXlnkd25fo8Q/exec',
};

async function main() {
  console.log('');
  console.log('==========================================');
  console.log('   사계 레기온 전투력 자동 수집');
  console.log('==========================================');
  console.log('');

  // 1. 구글 시트에서 길드원 목록 가져오기
  console.log('[1/3] 구글 시트에서 레기온원 목록 가져오는 중...');

  const sheetUrl = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:json`;

  let members = [];
  try {
    const response = await fetch(sheetUrl);
    const text = await response.text();

    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?$/);
    if (!jsonMatch) {
      console.log('시트 데이터를 파싱할 수 없습니다.');
      return;
    }

    const data = JSON.parse(jsonMatch[1]);
    const rows = data.table.rows;

    members = rows
      .map((row, index) => ({
        row: index + 2,  // 시트 2행부터 시작 (1행은 헤더)
        nickname: row.c[1]?.v || '',
      }))
      .filter(m => m.nickname);  // 닉네임이 있는 행만

    console.log(`      => ${members.length}명 발견!\n`);
  } catch (e) {
    console.log('시트 데이터 가져오기 실패:', e.message);
    return;
  }

  // 2. 브라우저 실행
  console.log('[2/3] 아툴에서 전투력 수집 중...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];

  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    const url = `https://www.aion2tool.com/char/serverid=${CONFIG.SERVER_ID}/${encodeURIComponent(member.nickname)}`;

    process.stdout.write(`   [${String(i + 1).padStart(2)}/${members.length}] ${member.nickname.padEnd(15)} `);

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(4000);

      let combatPower = null;      // 현재 전투력
      let combatScore = null;      // 현재 전투점수
      let maxCombatScore = null;   // 최고 전투점수

      try {
        combatPower = await page.$eval('#result-combat-power', el => el.textContent.trim());
      } catch {}

      try {
        combatScore = await page.$eval('#dps-score-value', el => el.textContent.trim());
      } catch {}

      // 최고 전투점수 찾기 (#combat-score-max-info 내의 strong 태그)
      try {
        maxCombatScore = await page.$eval('#combat-score-max-info strong', el => el.textContent.trim());
      } catch {}
      // 최고 점수를 못 찾으면 현재 점수로 대체
      if (!maxCombatScore && combatScore) {
        maxCombatScore = combatScore;
      }

      if (combatPower || combatScore || maxCombatScore) {
        results.push({
          row: member.row,
          nickname: member.nickname,
          maxCombatScore: maxCombatScore ? maxCombatScore.replace(/,/g, '') : '',
          combatScore: combatScore ? combatScore.replace(/,/g, '') : '',
          combatPower: combatPower ? combatPower.replace(/,/g, '') : '',
        });
        console.log(`=> 최고:${maxCombatScore || '-'} / 현재:${combatScore || '-'} / 전투력:${combatPower || '-'}`);
      } else {
        console.log(`=> 데이터 없음`);
      }
    } catch (e) {
      console.log(`=> 에러`);
    }
  }

  await browser.close();

  // 3. 구글 시트에 자동 업데이트
  console.log('\n[3/3] 구글 시트에 업데이트 중...\n');

  if (results.length === 0) {
    console.log('업데이트할 데이터가 없습니다.');
    return;
  }

  // 수집 시간 기록
  const now = new Date();
  const collectTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  try {
    const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        results: results,
        collectTime: collectTime,
      }),
      redirect: 'follow',
    });

    const responseText = await response.text();
    console.log('Apps Script 응답:', responseText);

    if (response.ok && responseText === 'OK') {
      console.log('==========================================');
      console.log('   구글 시트 업데이트 완료!');
      console.log('==========================================\n');
    } else if (response.ok) {
      console.log('==========================================');
      console.log('   Apps Script 응답 받음 (확인 필요)');
      console.log('==========================================\n');
    } else {
      console.log('구글 시트 업데이트 실패:', response.status);
    }
  } catch (e) {
    console.log('구글 시트 업데이트 에러:', e.message);
  }

  console.log(`수집 결과: ${results.length}명\n`);
  console.log('닉네임           | 최고점수  | 현재점수  | 전투력');
  console.log('----------------------------------------------------');
  results.forEach(r => {
    console.log(`${r.nickname.padEnd(15)} | ${r.maxCombatScore.padStart(8)} | ${r.combatScore.padStart(8)} | ${r.combatPower.padStart(6)}`);
  });
  console.log('');
}

main().catch(e => {
  console.error('에러 발생:', e.message);
});
