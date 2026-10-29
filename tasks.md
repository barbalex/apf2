---

✅ done 29.10.2026 — lists built with @tanstack/react-virtual 3.14.24

- `src/components/shared/List/index.tsx` now uses `useVirtualizer` (own scroll container, 35px estimate, `measureElement` for wrapping labels, `getItemKey` = row id). This one component powers all ~35 list pages under `Projekte/Daten/*` (incl. Beobachtungen lists with thousands of rows) plus `Docs/MobileList`.
- `index.module.css`: rows are absolutely positioned inside a total-size spacer; `content-visibility` perf hack removed (superseded); last-row border via `.rowLast` class since `:last-child` no longer works with windowing.
- `'use no memo'` added to the file: TanStack Virtual is on React Compiler's incompatible-library list (eslint warns `react-hooks/incompatible-library`).
- verified in browser on Cypripedium calceolus "Beobachtungen nicht beurteilt" (2675 rows): ~27 rows in DOM, scroll window shifts correctly, row click navigates, rows at exact 35px pitch. typecheck + lint clean.
- note: this List is the mobile view of list routes; on desktop, list routes show the parent form and rows render in the tree.

---

tree building: optimizable?

---

More virtual list candidates:

- Tree
- EkPlan's table
- Mitteilungen lists

---

---
