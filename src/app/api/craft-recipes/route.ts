import { NextRequest, NextResponse } from 'next/server';

const SHEET_ID = '1wbEUQNy9ShybtKkZRlUAsr-CcyY5LDRYOxWL6a0dMTo';
const CRAFT_SHEET_GID = '1866196411';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${CRAFT_SHEET_GID}`;
const PRICES_URL = 'https://api-aeid.lostgld.com/prices?faction=asmo';

interface Material {
  name: string;
  required: number;
  npcPrice: number;
  marketPrice: number | null;
}

interface CraftRecipe {
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
}

interface PriceEntry {
  name: string;
  price: number;
  last_updated: string;
  trend: string;
}

function normalizeGrade(grade: string, name: string): string {
  if (name.includes('기룡왕') || name.includes('기룡 패왕')) return '영웅';
  if (name.startsWith('달인의')) return '전승';
  if (name.startsWith('장인의') || grade === '고급') return '희귀';
  return grade;
}

export async function GET(request: NextRequest) {
  const forceRefresh = request.nextUrl.searchParams.get('refresh') === 'true';

  try {
    const sheetUrl = forceRefresh ? `${SHEET_URL}&_t=${Date.now()}` : SHEET_URL;

    const [sheetRes, pricesRes] = await Promise.all([
      fetch(sheetUrl, {
        cache: forceRefresh ? 'no-store' : 'default',
        next: forceRefresh ? undefined : { revalidate: 300 },
      }),
      fetch(PRICES_URL, {
        next: { revalidate: 300 },
      }).catch(() => null),
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

        recipeMap.set(id, {
          id,
          name,
          grade: normalizeGrade(String(cells[2] || '').trim(), name),
          category: String(cells[3] || '').trim(),
          successRate: Number(cells[4]) || 0,
          hasProc: String(cells[5]).trim().toUpperCase() === 'Y',
          procItem,
          procChance: Number(cells[7]) || 0,
          procSuccessRate: Number(cells[8]) || 0,
          materials: [],
          productPrice: priceMap.get(name) ?? null,
          procItemPrice: procItem ? (priceMap.get(procItem) ?? null) : null,
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
