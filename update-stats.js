/**
 * 사계 길드 - 아툴 데이터 자동 수집
 *
 * 결과: results.txt 파일로 저장 + 화면에 출력
 */

const { chromium } = require('playwright');
const fs = require('fs');

const CONFIG = {
  SERVER_ID: 2002,
  SHEET_ID: '1wbEUQNy9ShybtKkZRlUAsr-CcyY5LDRYOxWL6a0dMTo',
};

async function main() {
  console.log('');
  console.log('==========================================');
  console.log('   사계 길드 전투력 자동 수집');
  console.log('==========================================');
  console.log('');

  // 1. 구글 시트에서 길드원 목록 가져오기
  console.log('[1/3] 구글 시트에서 길드원 목록 가져오는 중...');

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
      await page.waitForTimeout(2500);

      let combatPower = null;
      let combatScore = null;

      try {
        combatPower = await page.$eval('#result-combat-power', el => el.textContent.trim());
      } catch {}

      try {
        combatScore = await page.$eval('#dps-score-value', el => el.textContent.trim());
      } catch {}

      if (combatPower || combatScore) {
        results.push({
          row: member.row,
          nickname: member.nickname,
          combatScore: combatScore ? combatScore.replace(/,/g, '') : '',
          combatPower: combatPower ? combatPower.replace(/,/g, '') : '',
        });
        console.log(`=> ${combatScore || '-'} / ${combatPower || '-'}`);
      } else {
        console.log(`=> 데이터 없음`);
      }
    } catch (e) {
      console.log(`=> 에러`);
    }
  }

  await browser.close();

  // 3. 결과 저장 및 출력
  console.log('\n[3/3] 결과 저장 중...\n');

  // 결과 파일 저장
  const output = results.map(r => `${r.combatScore}\t${r.combatPower}`).join('\n');
  fs.writeFileSync('results.txt', output, 'utf8');

  console.log('==========================================');
  console.log('   완료!');
  console.log('==========================================\n');

  console.log(`수집 결과: ${results.length}명\n`);
  console.log('닉네임           | 전투점수  | 전투력');
  console.log('------------------------------------------');
  results.forEach(r => {
    console.log(`${r.nickname.padEnd(15)} | ${r.combatScore.padStart(8)} | ${r.combatPower.padStart(6)}`);
  });

  console.log('\n------------------------------------------');
  console.log('\n[결과 파일] results.txt 저장됨');
  console.log('\n사용법:');
  console.log('1. results.txt 파일 열기');
  console.log('2. 전체 선택 (Ctrl+A) -> 복사 (Ctrl+C)');
  console.log('3. 구글 시트 G2 셀 클릭 -> 붙여넣기 (Ctrl+V)');
  console.log('');
}

main().catch(e => {
  console.error('에러 발생:', e.message);
});
