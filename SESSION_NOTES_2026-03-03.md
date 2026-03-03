# Session Notes - 2026-03-03

## Done today
- Added a new craft calculator page at `src/app/craft/page.tsx`.
- Calculator intentionally excludes success probability and expected-value logic.
- Implemented manual input for:
  - finished item sale price
  - owned count per material
  - market price per material

## Current formulas
- Per material shortage: `max(required - owned, 0)`
- Per material shortage cost: `shortage * marketPrice`
- Total shortage material cost: sum of all shortage costs
- Settlement amount per fee option:
  - Server fee 22%: `salePrice * 0.78`
  - Market fee 12%: `salePrice * 0.88`
  - Personal use 0%: `salePrice * 1.00`
- Profit per scenario: `settlementAmount - totalShortageMaterialCost`

## UI/behavior
- Route: `/craft`
- Includes:
  - target item select (sample data)
  - materials table with required / owned / shortage / market price / shortage cost
  - summary for total shortage material cost
  - settlement + profit table (22/12/0)

## Next suggested tasks
1. Replace sample recipe data with real item/material data source.
2. Add `/craft` entry card in home page (`src/app/page.tsx`) carefully (encoding-safe edit).
3. Decide persistence strategy (localStorage or server) for input values.

## Note
- `public/sw.js` was already modified in working tree before this commit scope; not changed in this feature.
