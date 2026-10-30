---
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

---

More virtual list candidates:

- EkPlan's table
- Mitteilungen lists

---

---
