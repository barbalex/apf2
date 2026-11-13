# tree2: replace the iframe with a real second pane

Status: design + E2E safety net exist ([tests/tree2/tree2.spec.ts](../tests/tree2/tree2.spec.ts));
implementation is its own project, not a drive-by change.

## Why the iframe exists

The second tree (`?projekteTabs=…tree2…`) is the **whole app loaded again in an
iframe** ([src/components/Projekte/index.tsx](../src/components/Projekte/index.tsx)).
That is the only currently available isolation mechanism, because the app's
state is a singleton in two dimensions:

1. **One jotai store**: `export const store = createStore()`
   ([src/store/store.ts](../src/store/store.ts)). All atoms live in it.
2. **One URL**: `treeActiveNodeArrayAtom` mirrors the browser URL
   ([src/components/Router/ActiveNodeArraySetter.tsx](../src/components/Router/ActiveNodeArraySetter.tsx)).

A second pane needs its own active node array (and open nodes, label filter,
map filter, …) — i.e. a second store instance — while the iframe gets both for
free by simply being a second app instance.

## What the iframe costs

- a second full React tree, bundle and PWA runtime (memory)
- a second auth session sharing localStorage
- every parent re-navigation sets a new iframe `src` → **full app reload of the
  pane** (`tree2SrcAtom` / `setTree2SrcByActiveNodeArrayAtom`)
- no shared React state: syncing happens through URL/localStorage only
- in-iframe navigation never updates the address bar; browser reload loses it

## Why a naive in-app render does not work (yet)

Rendering `<ProjektContainer />` a second time inside a jotai
`<Provider store={secondStore}>` scopes all **React-path** atom access
(`useAtomValue`/`useSetAtom`) correctly — that part is free. The app also has a
large imperative surface that talks to the **singleton** store directly, and
those calls would silently operate pane 2 on pane 1's state:

- tree interactions: `openNode`, `toggleNode`, `toggleNodeSymbol`,
  `insertDataset`, `closeLowerNodes`, all of `openLowerNodes/*/index.ts`,
  `DeleteDatasetModal/delete`
- Daten menus, Karte layers (`Marker`/`Polyline` popups call
  `openTree2WithActiveNodeArray`), `invalidateTreeQueries`,
  `navigateToLastActiveNodeArray`, export modules, `logout`

(Grep: `store\.(get|set)` outside React — dozens of modules.)

Additional per-store issues to solve:

- `atomWithStorage` atoms initialize each store from localStorage and then
  diverge (label filter, map layers, `userAtom`!). `userAtom` divergence breaks
  auth in pane 2 after (re)login in pane 1 — user/token atoms must stay shared
  or be synced across stores.
- `tsQueryClientAtom` / `QueryClient`: sharing one client is desirable
  (mutations invalidate both panes' queries); it must be set in both stores.
- `inIframe()` gates the app bar; an in-app pane needs a first-class
  "pane" context instead (`isInIframe` checks in ~10 components).
- `window`-global side effects: `document.title`, print handling
  (`isPrintAtom`), PWA `VersionCheck`, Electron handlers — must be pane-aware
  or root-only.

## Recommended approach

Introduce a **store-resolution layer** instead of a module-level singleton:

1. `getStore()` returns the store of the pane the currently executing code
   belongs to. Implementation: a `AsyncLocalStorage`-like slot is not available
   in the browser; use an explicit `pane` argument threaded through the
   imperative helpers (preferred — explicit beats clever) or, as a migration
   aid, a "last-interacted pane" module variable set by a pointerdown listener
   (known race for post-await continuations; acceptable only temporarily).
2. Convert the imperative helpers to take `store` (or `pane`) as a parameter,
   starting with the TreeContainer modules above — mechanical, one PR per
   module group, unit-testable.
3. Render pane 2 as `<Provider store={tree2Store}><ProjektContainer
   pane="tree2" /></Provider>` behind a `MemoryRouter`-free setup (pane 2 keeps
   its navigation in atoms only; the address bar stays pane 1's).
4. Keep `userAtom`, `tsQueryClientAtom` and notification atoms shared: mount
   them in both stores and bridge writes (`store.sub` on one, `set` on the
   other), or hoist them out of the pane stores entirely.
5. Replace `inIframe()` with `PaneContext` (`'root' | 'tree2'`); keep
   `inIframe()` only for the legacy/Electron paths.

## Acceptance

- [tests/tree2/tree2.spec.ts](../tests/tree2/tree2.spec.ts) stays green with
  the iframe-specific assertions replaced by pane equivalents
  (second workspace renders, opens on the active node, closes cleanly)
- no full pane reload on parent navigation (assert: pane component identity
  survives, e.g. via a data-attribute counter)
- Playwright suite + manual check of: login/logout, copy/paste between panes,
  map popups "in zweitem Baum öffnen", print, Electron
