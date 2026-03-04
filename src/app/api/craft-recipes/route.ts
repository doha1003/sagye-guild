import { NextRequest, NextResponse } from 'next/server';

const SHEET_ID = '1wbEUQNy9ShybtKkZRlUAsr-CcyY5LDRYOxWL6a0dMTo';
const CRAFT_SHEET_GID = '1866196411';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${CRAFT_SHEET_GID}`;
const PRICES_URL = 'https://api-aeid.lostgld.com/prices?faction=asmo';
const INVEN_API = 'https://aion2.inven.co.kr/db/api/item/getList';
const INVEN_GRADE: Record<number, string> = { 1: '일반', 2: '고급', 3: '희귀', 4: '유일', 5: '영웅' };

interface Material {
  name: string;
  required: number;
  npcPrice: number;
  marketPrice: number | null;
}

interface InvenItemInfo {
  grade?: string;
  itemLevel?: number;
  equipLevel?: number;
  mainStat?: { option: string; value: string | number }[];
  magicstoneCount?: number;
  randomCount?: number;
  godstoneCount?: number;
  spiritstoneCount?: number;
  invenCode?: number;
  icon?: string;
}

interface CraftRecipe extends InvenItemInfo {
  id: number;
  name: string;
  grade: string;
  category: string;
  successRate: number;
  hasProc: boolean;
  procItem: string;
  procChance: number;
  procSuccessRate: number;
  materials: Material[];
  productPrice: number | null;
  procItemPrice: number | null;
  procItemInfo?: InvenItemInfo;
}

interface PriceEntry {
  name: string;
  price: number;
  last_updated: string;
  trend: string;
}

interface InvenApiItem {
  code: number;
  name: string;
  grade: number;
  item_level: number;
  equip_level: number;
  main_stat: { option: string; value: string | number }[];
  magicstone_count: number;
  random_count: number;
  godstone_count: number;
  spiritstone_count: number;
  icon: string;
  race: number;
}

function toInvenItemInfo(item: InvenApiItem): InvenItemInfo {
  return {
    grade: INVEN_GRADE[item.grade],
    itemLevel: item.item_level || undefined,
    equipLevel: item.equip_level || undefined,
    mainStat: item.main_stat?.length ? item.main_stat : undefined,
    magicstoneCount: item.magicstone_count || undefined,
    randomCount: item.random_count || undefined,
    godstoneCount: item.godstone_count || undefined,
    spiritstoneCount: item.spiritstone_count || undefined,
    invenCode: item.code,
    icon: item.icon || undefined,
  };
}


export async function GET(request: NextRequest) {
  const forceRefresh = request.nextUrl.searchParams.get('refresh') === 'true';

  try {
    const sheetUrl = forceRefresh ? `${SHEET_URL}&_t=${Date.now()}` : SHEET_URL;

    const [sheetRes, pricesRes, invenEquipRes, invenConsumeRes] = await Promise.all([
      fetch(sheetUrl, {
        cache: forceRefresh ? 'no-store' : 'default',
        next: forceRefresh ? undefined : { revalidate: 300 },
      }),
      fetch(PRICES_URL, {
        next: { revalidate: 300 },
      }).catch(() => null),
      fetch(`${INVEN_API}?class1=2`, { next: { revalidate: 3600 } }).catch(() => null),
      fetch(`${INVEN_API}?class1=3`, { next: { revalidate: 3600 } }).catch(() => null),
    ]);

    const text = await sheetRes.text();
    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?$/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse sheet data' }, { status: 500 });
    }

    // 가격 데이터 파싱
    const priceMap = new Map<string, number>();
    if (pricesRes?.ok) {
      const prices: Record<string, PriceEntry> = await pricesRes.json();
      for (const entry of Object.values(prices)) {
        if (entry.name && entry.price) priceMap.set(entry.name, entry.price);
      }
    }

    // 인벤 데이터 파싱 (name → InvenApiItem)
    const invenMap = new Map<string, InvenApiItem>();
    for (const res of [invenEquipRes, invenConsumeRes]) {
      if (!res?.ok) continue;
      try {
        const json = await res.json();
        if (!json.success || !Array.isArray(json.data)) continue;
        for (const item of json.data as InvenApiItem[]) {
          if (item.race === 1) continue; // 천족 제외
          invenMap.set(item.name, item);
        }
      } catch { /* graceful fallback */ }
    }

    const data = JSON.parse(jsonMatch[1]);
    const rows = data.table.rows;
    const recipeMap = new Map<number, CraftRecipe>();

    for (const row of rows) {
      const cells = row.c.map((cell: { v: string | number | null } | null) => cell?.v ?? '');
      const id = Number(cells[0]);
      if (!id || isNaN(id)) continue;

      const materialName = String(cells[9] || '').trim();
      const materialRequired = Number(cells[10]) || 0;
      const materialNpcPrice = Number(cells[11]) || 0;

      if (!recipeMap.has(id)) {
        const name = String(cells[1] || '').trim();
        const procItem = String(cells[6] || '').trim();
        const sheetGrade = String(cells[2] || '').trim();
        const invenItem = invenMap.get(name);
        const invenInfo = invenItem ? toInvenItemInfo(invenItem) : undefined;
        const procInvenItem = procItem ? invenMap.get(procItem) : undefined;

        recipeMap.set(id, {
          id,
          name,
          category: String(cells[3] || '').trim(),
          successRate: Number(cells[4]) || 0,
          hasProc: String(cells[5]).trim().toUpperCase() === 'Y',
          procItem,
          procChance: Number(cells[7]) || 0,
          procSuccessRate: Number(cells[8]) || 0,
          materials: [],
          productPrice: priceMap.get(name) ?? null,
          procItemPrice: procItem ? (priceMap.get(procItem) ?? null) : null,
          ...invenInfo,
          grade: invenInfo?.grade || sheetGrade,
          procItemInfo: procInvenItem ? toInvenItemInfo(procInvenItem) : undefined,
        });
      }

      if (materialName) {
        recipeMap.get(id)!.materials.push({
          name: materialName,
          required: materialRequired,
          npcPrice: materialNpcPrice,
          marketPrice: priceMap.get(materialName) ?? null,
        });
      }
    }

    const recipes = Array.from(recipeMap.values());
    const categories = [...new Set(recipes.map((r) => r.category))].sort();
    const grades = [...new Set(recipes.map((r) => r.grade))];

    return NextResponse.json({
      recipes,
      categories,
      grades,
      totalCount: recipes.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Craft recipes API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch craft recipe data' },
      { status: 500 }
    );
  }
}
