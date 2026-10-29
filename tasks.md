---

✅ done 29.10.2026 — lists built with @tanstack/react-virtual 3.14.24

- `src/components/shared/List/index.tsx` now uses `useVirtualizer` (own scroll container, 35px estimate, `measureElement` for wrapping labels, `getItemKey` = row id). This one component powers all ~35 list pages under `Projekte/Daten/*` (incl. Beobachtungen lists with thousands of rows) plus `Docs/MobileList`.
- `index.module.css`: rows are absolutely positioned inside a total-size spacer; `content-visibility` perf hack removed (superseded); last-row border via `.rowLast` class since `:last-child` no longer works with windowing.
- `'use no memo'` added to the file: TanStack Virtual is on React Compiler's incompatible-library list (eslint warns `react-hooks/incompatible-library`).
- verified in browser on Cypripedium calceolus "Beobachtungen nicht beurteilt" (2675 rows): ~27 rows in DOM, scroll window shifts correctly, row click navigates, rows at exact 35px pitch. typecheck + lint clean.
- note: this List is the mobile view of list routes; on desktop, list routes show the parent form and rows render in the tree.

---

✅ done 30.10.2026 — tree virtualized with @tanstack/react-virtual

- `Tree/index.tsx` window-renders a flat rows array built by `useVisibleTreeRows` (walk of root menus + children registry + openNodes). ~40 rows in DOM even with 2675 beob nodes open. Rows keyed by treeUrl → React never remounts untouched rows.
- **per-node data flow kept** (the flicker fix): each open folder's `use*NavData` fetcher runs in a hidden `ChildLoader` per virtualized row and registers its menus (`virtualTreeAtoms.ts`). Registrations survive window scroll-out, so rows don't vanish and nothing refetches wholesale.
- `RootProviders` registers the 5 roots (statically, like Root/RootNode did — users fetcher must stay static).
- `IntoViewScroller` (DOM query + scrollIntoView) replaced by `scrollToIndex` driven off rows changes. Three bugs fixed along the way:
  1. window-gated loading deadlock: children of out-of-window folders never loaded → `FocusPathLoader` loads ancestors of the focus target level by level.
  2. close-guard poisoned scrolling: equal-content re-sets of activeNodeArray counted as "closed" (`>=` in the old check); now strictly-shorter-prefix only, non-sticky.
  3. form urls with trailing singular segment ('.../Feld-Kontrolle') have no tree row → scroll to deepest existing ancestor row instead.
- `ChildLoader` must be **keyed by row key** when reused (FocusPathLoader): switching fetcher hooks inside a live component crashes with `prevDeps.join is not a function`.
- expand/collapse fade animations (react-transition-group) dropped — windowed rows can't animate exits.
- deleted Root/RootNode/RootUsersNode/Node/NodeWithList/NodeWithListTransitioned/Folders/NodesList/IntoViewScroller; stripped `component:` fields from all navData modules.
- verified: 2675-row folder (~40 DOM rows), fast scrolling, click-through without flicker/remounts, 'alle öffnen/schliessen' (331 pops), context menu, mobile view, deep-url scroll-into-view (exact row, out-of-sight Art folder, Feld-Kontrolle form url). typecheck + lint clean.

---

tree building: lets implement this method into ps as well

---

More virtual list candidates:

- EkPlan's table
- Mitteilungen lists

---

tree:

one thing to watch: before having every node query its own data, clicking through nodes made the tree flicker, sometimes even reload from scratch. This should not happen

---
