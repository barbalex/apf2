import { lazy } from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { Spinner } from '../shared/Spinner.tsx'

const DatenNav = lazy(async () => ({
  default: (await import('../Bookmarks/NavTo/Navs/Daten.tsx')).Menu,
}))
const datenHandle = {
  nav: DatenNav,
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useRootNavData',
}


// WARNING: errorElement did not work
// import { ErrorBoundary } from '../shared/ErrorBoundary.tsx'

import { Unterhalt } from '../Unterhalt.tsx'

// uncomment unterhalt route for Unterhalt
export const Router = () => {

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
