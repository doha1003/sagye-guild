'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type Material = {
  id: string;
  name: string;
  required: number;
};

type Recipe = {
  id: string;
  name: string;
  materials: Material[];
};

type SettlementOption = {
  id: 'server' | 'market' | 'personal';
  label: string;
  feeRate: number;
};

const RECIPES: Recipe[] = [
  {
    id: 'sample-greatsword',
    name: 'Sample Greatsword',
    materials: [
      { id: 'mythril-ingot', name: 'Mythril Ingot', required: 12 },
      { id: 'mana-core', name: 'Mana Core', required: 6 },
      { id: 'spirit-powder', name: 'Spirit Powder', required: 24 },
      { id: 'ancient-wood', name: 'Ancient Wood', required: 8 },
    ],
  },
  {
    id: 'sample-robe',
    name: 'Sample Robe',
    materials: [
      { id: 'silk-cloth', name: 'Silk Cloth', required: 16 },
      { id: 'mana-thread', name: 'Mana Thread', required: 14 },
      { id: 'moon-crystal', name: 'Moon Crystal', required: 5 },
      { id: 'blessed-water', name: 'Blessed Water', required: 10 },
    ],
  },
  {
    id: 'sample-ring',
    name: 'Sample Ring',
    materials: [
      { id: 'gold-ingot', name: 'Gold Ingot', required: 10 },
      { id: 'gem-fragment', name: 'Gem Fragment', required: 18 },
      { id: 'arcane-dust', name: 'Arcane Dust', required: 9 },
    ],
  },
];

const SETTLEMENT_OPTIONS: SettlementOption[] = [
  { id: 'server', label: 'Server fee 22%', feeRate: 0.22 },
  { id: 'market', label: 'Market fee 12%', feeRate: 0.12 },
  { id: 'personal', label: 'Personal use 0%', feeRate: 0 },
];

function parseNonNegativeInt(value: string): number {
  const n = Number(value.replace(/,/g, '').trim());
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

function formatKina(value: number): string {
  return Math.round(value).toLocaleString();
}

export default function CraftPage() {
  const [recipeId, setRecipeId] = useState<string>(RECIPES[0].id);
  const [ownedByMaterial, setOwnedByMaterial] = useState<Record<string, string>>({});
  const [priceByMaterial, setPriceByMaterial] = useState<Record<string, string>>({});
  const [finishedPriceInput, setFinishedPriceInput] = useState<string>('0');

  const selectedRecipe = useMemo(
    () => RECIPES.find((recipe) => recipe.id === recipeId) ?? RECIPES[0],
    [recipeId]
  );

  const materialRows = useMemo(() => {
    return selectedRecipe.materials.map((material) => {
      const owned = parseNonNegativeInt(ownedByMaterial[material.id] ?? '0');
      const marketPrice = parseNonNegativeInt(priceByMaterial[material.id] ?? '0');
      const shortage = Math.max(material.required - owned, 0);
      const shortageCost = shortage * marketPrice;

      return {
        ...material,
        owned,
        marketPrice,
        shortage,
        shortageCost,
      };
    });
  }, [ownedByMaterial, priceByMaterial, selectedRecipe.materials]);

  const totalMaterialCost = useMemo(
    () => materialRows.reduce((sum, row) => sum + row.shortageCost, 0),
    [materialRows]
  );

  const finishedPrice = parseNonNegativeInt(finishedPriceInput);

  const settlementRows = useMemo(() => {
    return SETTLEMENT_OPTIONS.map((option) => {
      const settlementAmount = finishedPrice * (1 - option.feeRate);
      const profit = settlementAmount - totalMaterialCost;

      return {
        ...option,
        settlementAmount,
        profit,
      };
    });
  }, [finishedPrice, totalMaterialCost]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300">
            Sagye Guild
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/members" className="text-zinc-400 hover:text-white">
              Members
            </Link>
            <Link href="/schedule" className="text-zinc-400 hover:text-white">
              Schedule
            </Link>
            <Link href="/craft" className="text-amber-400">
              Craft
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Craft Calculator</h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Formula: shortage cost = (required - owned) x market price, then sum all shortage costs.
          </p>
        </section>

        <section className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 sm:p-6 mb-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-zinc-400">Target item</span>
              <select
                className="mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2"
                value={selectedRecipe.id}
                onChange={(event) => setRecipeId(event.target.value)}
              >
                {RECIPES.map((recipe) => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-zinc-400">Finished item sale price</span>
              <input
                type="text"
                inputMode="numeric"
                className="mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2"
                value={finishedPriceInput}
                onChange={(event) => setFinishedPriceInput(event.target.value)}
                placeholder="0"
              />
            </label>
          </div>
        </section>

        <section className="bg-zinc-800/50 border border-zinc-700 rounded-xl overflow-hidden mb-6">
          <div className="p-4 border-b border-zinc-700">
            <h2 className="font-semibold">Materials</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-zinc-900">
                <tr className="text-zinc-400">
                  <th className="text-left p-3">Material</th>
                  <th className="text-right p-3">Required</th>
                  <th className="text-right p-3">Owned</th>
                  <th className="text-right p-3">Shortage</th>
                  <th className="text-right p-3">Market price</th>
                  <th className="text-right p-3">Shortage cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {materialRows.map((row) => (
                  <tr key={row.id} className="hover:bg-zinc-800/70">
                    <td className="p-3 font-medium">{row.name}</td>
                    <td className="p-3 text-right">{row.required.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <input
                        type="text"
                        inputMode="numeric"
                        className="w-24 ml-auto bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-right"
                        value={ownedByMaterial[row.id] ?? ''}
                        onChange={(event) =>
                          setOwnedByMaterial((prev) => ({ ...prev, [row.id]: event.target.value }))
                        }
                        placeholder="0"
                      />
                    </td>
                    <td className="p-3 text-right text-amber-400">{row.shortage.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <input
                        type="text"
                        inputMode="numeric"
                        className="w-32 ml-auto bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-right"
                        value={priceByMaterial[row.id] ?? ''}
                        onChange={(event) =>
                          setPriceByMaterial((prev) => ({ ...prev, [row.id]: event.target.value }))
                        }
                        placeholder="0"
                      />
                    </td>
                    <td className="p-3 text-right font-semibold">{formatKina(row.shortageCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-zinc-700 bg-zinc-900/70 flex items-center justify-between">
            <span className="text-zinc-400">Total shortage material cost</span>
            <strong className="text-lg text-amber-400">{formatKina(totalMaterialCost)} kina</strong>
          </div>
        </section>

        <section className="bg-zinc-800/50 border border-zinc-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-zinc-700">
            <h2 className="font-semibold">Settlement and Profit</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-zinc-900">
                <tr className="text-zinc-400">
                  <th className="text-left p-3">Scenario</th>
                  <th className="text-right p-3">Settlement amount</th>
                  <th className="text-right p-3">Profit (settlement - material cost)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {settlementRows.map((row) => (
                  <tr key={row.id} className="hover:bg-zinc-800/70">
                    <td className="p-3">{row.label}</td>
                    <td className="p-3 text-right">{formatKina(row.settlementAmount)} kina</td>
                    <td
                      className={`p-3 text-right font-bold ${
                        row.profit > 0 ? 'text-emerald-400' : row.profit < 0 ? 'text-red-400' : 'text-zinc-300'
                      }`}
                    >
                      {row.profit > 0 ? '+' : ''}
                      {formatKina(row.profit)} kina
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

