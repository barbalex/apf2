import { lazy } from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { useAtomValue } from 'jotai'

import { Spinner } from '../shared/Spinner.tsx'

const DatenNav = lazy(async () => ({
  default: (await import('../Bookmarks/NavTo/Navs/Daten.tsx')).Menu,
}))
const datenBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useRootNavData.ts')).useRootNavData,
}))
const datenHandle = {
  nav: DatenNav,
  bookmarkFetcher: datenBookmarkFetcher,
  bookmarkFetcherName: 'useRootNavData',
}

import { isDesktopViewAtom } from '../../store/index.ts'

// WARNING: errorElement did not work
// import { ErrorBoundary } from '../shared/ErrorBoundary.tsx'

import { Unterhalt } from '../Unterhalt.tsx'

// uncomment unterhalt route for Unterhalt
export const Router = () => {
  const isDesktopView = useAtomValue(isDesktopViewAtom)

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        lazy={() => import('../AppBar/index.tsx')}
        hydrateFallbackElement={<Spinner />}
      >
        <Route index lazy={() => import('../Home/index.tsx')} />
        <Route
          path="/Daten"
          lazy={() => import('./ProtectedRoute.tsx')}
          handle={datenHandle}
        >
          <Route path="*" element={<Unterhalt />}></Route>
        </Route>
      </Route>,
    ),
  )

  return <RouterProvider router={router} />
}
