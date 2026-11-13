import { createRef, Suspense, useEffect, useMemo, useRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import {
  createMemoryRouter,
  createRoutesFromElements,
  Outlet,
  Route,
} from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { Provider as JotaiProvider } from 'jotai'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { UploadCtxProvider } from '@uploadcare/file-uploader'

import { theme } from '../../../utils/materialTheme.ts'
import {
  store as rootStore,
  tsQueryClientAtom,
  unsetNavigateObjectAtom,
} from '../../../store/index.ts'
import {
  tree2Store,
  tree2OpenAtom,
  initTree2SharedAtoms,
  bridgeTree2Notifications,
} from '../../../store/tree2.ts'
import { datenRoutes } from '../../Router/index.tsx'
import { ActiveNodeArraySetter } from '../../Router/ActiveNodeArraySetter.tsx'
import { NavigateSetter } from '../../Router/NavigateSetter.tsx'
import { UploaderContext } from '../../../UploaderContext.ts'
import { Spinner } from '../../shared/Spinner.tsx'

import styles from './index.module.css'

// shares the root app's query client so mutations invalidate both panes;
// a fresh client is a last-resort fallback (the atom is set by the root's
// QueryClientSetter long before the pane can mount)
const useSharedQueryClient = () =>
  useMemo(() => rootStore.get(tsQueryClientAtom) ?? new QueryClient(), [])

// pane chrome wrapped around every pane route: one-time wiring plus the
// URL(memory) -> treeActiveNodeArrayAtom sync. Needs to live inside the
// router context, hence the pathless layout route below
const PaneChrome = () => {
  useMemo(() => {
    initTree2SharedAtoms()
    bridgeTree2Notifications()
  }, [])
  return (
    <>
      <NavigateSetter />
      <ActiveNodeArraySetter />
      <Outlet />
    </>
  )
}

const usePaneRouter = (path: string) =>
  useMemo(
    () =>
      createMemoryRouter(
        createRoutesFromElements(
          <Route
            element={<PaneChrome />}
            hydrateFallbackElement={<Spinner />}
          >
            {datenRoutes}
          </Route>,
        ),
        { initialEntries: [path] },
      ),
    // mount-only: once the pane is open, navigation goes through its
    // navigateObjectAtom (setTree2PathByActiveNodeArrayAtom)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

// the workspace rendered inside the pane's own React root. The uploadcare
// context provider is a childless sibling (like in App.tsx) — it is a
// non-rendering custom element and must not wrap the layout
const PaneApp = ({ path }: { path: string }) => {
  const router = usePaneRouter(path)
  const queryClient = useSharedQueryClient()
  const uploaderRef = createRef<UploadCtxProvider | null>()

  return (
    <JotaiProvider store={tree2Store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <uc-upload-ctx-provider
            id="uploaderctx-tree2"
            ctx-name="uploadcare"
            ref={uploaderRef}
          ></uc-upload-ctx-provider>
          <UploaderContext value={uploaderRef}>
            <Suspense fallback={<Spinner />}>
              <RouterProvider router={router} />
            </Suspense>
          </UploaderContext>
        </ThemeProvider>
      </QueryClientProvider>
    </JotaiProvider>
  )
}

// react roots of open panes, keyed by their host element — lets the
// StrictMode double-invoked effects reuse the root instead of unmounting
// it mid-render (unmounting a root synchronously during render is the
// race React warns about)
const paneRoots = new WeakMap<HTMLDivElement, Root>()

// the second tree: the same workspace (the app's /Daten route tree)
// rendered against its own React root, jotai store and memory router —
// the successor of the former whole-app iframe. react-router forbids
// nesting any router inside the app router, hence the separate root.
// Like with the iframe the pane's navigation stays in memory and the
// browser address bar belongs to pane 1 — unlike the iframe there is no
// second app load: navigating pane 1 never reloads the pane
// (issues/tree2-second-pane.md)
export const Tree2 = ({ path }: { path: string }) => {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    // explicit opens must target this live pane (see setTree2PathByActiveNodeArrayAtom)
    rootStore.set(tree2OpenAtom, true)
    let root = paneRoots.get(host)
    if (!root) {
      root = createRoot(host)
      paneRoots.set(host, root)
    }
    root.render(<PaneApp path={path} />)

    return () => {
      // deferred + only when the host really left the DOM: covers the
      // real unmount (pane closed) without racing StrictMode's effect
      // re-run
      queueMicrotask(() => {
        const current = paneRoots.get(host)
        if (current === root && !host.isConnected) {
          paneRoots.delete(host)
          root?.unmount()
          // the pane's navigate outlives the unmounted memory router —
          // drop it plus the open flag so a later explicit open sets the
          // start path instead of navigating a dead router
          rootStore.set(tree2OpenAtom, false)
          tree2Store.set(unsetNavigateObjectAtom)
        }
      })
    }
    // path is mount-only by design (see usePaneRouter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={hostRef}
      data-id="tree2-pane"
      className={styles.pane}
    />
  )
}
