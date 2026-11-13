# tree2: replace the iframe with a real second pane

Status: **implemented** (2026-11-13) — the iframe is gone. The pane renders
the /Daten route tree against its own React root, jotai store and memory
router; see [src/store/tree2.ts](../src/store/tree2.ts) and
[src/components/Projekte/Tree2](../src/components/Projekte/Tree2/index.tsx).
Deviations from the original plan are noted at the bottom.

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

## Implementation notes (2026-13-11)

- react-router (v8) forbids nesting ANY router inside the app router —
  both MemoryRouter and RouterProvider throw. The pane therefore renders
  in its own React root (`createRoot`), which also matches the former
  iframe's isolation without the reload costs.
- The pane reuses the app's `/Daten` route subtree (`datenRoutes` in
  [src/components/Router/index.tsx](../src/components/Router/index.tsx))
  under a pathless layout route that carries the pane's
  ActiveNodeArraySetter/NavigateSetter.
- Imperative helpers take an explicit `store` param; hooks use
  `useStore()`. Shared atoms (user, query client) are mirrored once at
  pane mount, notifications are bridged into the root snackbar.
- `karte2`/`filter2` pane tabs currently have no effect on an open pane
  (the pane's tab set is fixed at mount); the pane-1 tab buttons still
  control pane 1 only. Can be revisited if missed.
- The pane host must be a flex column: the routed workspace's root is a
  flex child of the AppBar layout (`flex-grow: 1`), so without that
  context the height chain collapses. The uploadcare context provider is
  a childless sibling (like in App.tsx) — wrapping the layout in the
  custom element breaks it the same way (it does not render).
- Opening without an explicit target derives from pane 1's location only
  once the router is idle (`useNavigation().state`): tree clicks open
  nodes (rows become visible) before their navigation commits, and
  reading the location earlier can catch one that is about to change.
- The pane's React root is kept in a WeakMap keyed by its host element
  and unmounts deferred+disconnected-checked — unmounting synchronously
  in the effect cleanup races React's render (StrictMode double-invoke
  warns about exactly that).

## Explicit opens + navigate isolation (2026-11-13, round 2)

Two related bugs surfaced via QK ("opens at pane 1's node instead of the
object to correct"):

1. The pane's `navigateObjectAtom` outlives the pane (module-level
   store): an explicit open after an open/close cycle navigated the dead
   memory router instead of setting the start path. Fixed with
   `tree2OpenAtom` (maintained by the pane component) gating the open
   action, plus clearing the pane's navigate on unmount.
2. Worse: `ProtectedRoute` renders a bare `NavigateSetter` — inside the
   pane it overwrote the ROOT store's navigate with the memory router's,
   so after opening tree2, pane-1 tree clicks navigated the pane; after
   closing, they navigated nothing at all. `NavigateSetter` now resolves
   its store via `useStore()` (Provider-scoped in the pane, the app
   store in the main tree).

Pinned by unit tests on the open action (closed / stale-navigate /
open-pane branches) and an E2E regression: open tree2, close it, open a
QK message — the pane must open on the message's node, not pane 1's.

## Round 3: explicit open wiped mid-navigation (2026-11-13)

Reproduced via a page reload on the QK page + message click: the open
action set the pane path correctly, but during the tab-opening
navigation's loading phase the pane-1 derive/reset effect saw
tabs-not-yet-committed + path-set and its RESET branch wiped the just-set
path — after commit, the derive replaced it with pane 1's location. The
effect now returns early unless `navigation.state === 'idle'` (both
branches gated). The AppBar "tab menus invisible" report did not
reproduce after this fix — it was downstream of the broken pane state.
The QK E2E now reloads the page before clicking the message.
