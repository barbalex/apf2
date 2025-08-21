import { lazy } from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { useAtom } from 'jotai'

import { Spinner } from '../shared/Spinner.jsx'

// import { DatenNav } from '../Bookmarks/NavTo/Navs/Daten.jsx'

const DatenNav = lazy(async () => ({
  default: (await import('../Bookmarks/NavTo/Navs/Daten.jsx')).Menu,
}))
const datenBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useRootNavData.js')).useRootNavData,
}))
const datenHandle = {
  nav: DatenNav,
  bookmarkFetcher: datenBookmarkFetcher,
  bookmarkFetcherName: 'useRootNavData',
}
const ProjekteNav = lazy(async () => ({
  default: (await import('../Bookmarks/NavTo/Navs/Projects.jsx')).Menu,
}))
const projekteBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useProjekteNavData.js'))
    .useProjekteNavData,
}))
const projekteHandle = {
  nav: ProjekteNav,
  bookmarkFetcher: projekteBookmarkFetcher,
  bookmarkFetcherName: 'useProjekteNavData',
}
const projektBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useProjektNavData.js'))
    .useProjektNavData,
}))
const projektHandle = {
  bookmarkFetcher: projektBookmarkFetcher,
  bookmarkFetcherName: 'useProjektNavData',
}
const apberuebersichtsBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useApberuebersichtsNavData.js'))
    .useApberuebersichtsNavData,
}))
const apberuebersichtsHandle = {
  bookmarkFetcher: apberuebersichtsBookmarkFetcher,
  bookmarkFetcherName: 'useApberuebersichtsNavData',
}
const apsBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useApsNavData.js')).useApsNavData,
}))
const apsHandle = {
  bookmarkFetcher: apsBookmarkFetcher,
  bookmarkFetcherName: 'useApsNavData',
}
const usersBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useUsersNavData.js')).useUsersNavData,
}))
const usersHandle = {
  bookmarkFetcher: usersBookmarkFetcher,
  bookmarkFetcherName: 'useUsersNavData',
}
const currentissuesBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useCurrentissuesNavData.js'))
    .useCurrentissuesNavData,
}))
const currentissuesHandle = {
  bookmarkFetcher: currentissuesBookmarkFetcher,
  bookmarkFetcherName: 'useCurrentissuesNavData',
}
const messagesBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useMessagesNavData.js'))
    .useMessagesNavData,
}))
const messagesHandle = {
  bookmarkFetcher: messagesBookmarkFetcher,
  bookmarkFetcherName: 'useMessagesNavData',
}
const wertesBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useWertesNavData.js')).useWertesNavData,
}))
const wertesHandle = {
  bookmarkFetcher: wertesBookmarkFetcher,
  bookmarkFetcherName: 'useWertesNavData',
}
const adressesBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useAdressesNavData.js'))
    .useAdressesNavData,
}))
const adressesHandle = {
  bookmarkFetcher: adressesBookmarkFetcher,
  bookmarkFetcherName: 'useAdressesNavData',
}
const tpopApberrelevantGrundWertesBookmarkFetcher = lazy(async () => ({
  default: (
    await import('../../modules/useTpopApberrelevantGrundWertesNavData.js')
  ).useTpopApberrelevantGrundWertesNavData,
}))
const tpopApberrelevantGrundWertesHandle = {
  bookmarkFetcher: tpopApberrelevantGrundWertesBookmarkFetcher,
  bookmarkFetcherName: 'useTpopApberrelevantGrundWertesNavData',
}
const ekAbrechnungstypWertesBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useEkAbrechnungstypWertesNavData.js'))
    .useEkAbrechnungstypWertesNavData,
}))
const ekAbrechnungstypWertesHandle = {
  bookmarkFetcher: ekAbrechnungstypWertesBookmarkFetcher,
  bookmarkFetcherName: 'useEkAbrechnungstypWertesNavData',
}
const tpopkontrzaehlEinheitWertesBookmarkFetcher = lazy(async () => ({
  default: (
    await import('../../modules/useTpopkontrzaehlEinheitWertesNavData.js')
  ).useTpopkontrzaehlEinheitWertesNavData,
}))
const tpopkontrzaehlEinheitWertesHandle = {
  bookmarkFetcher: tpopkontrzaehlEinheitWertesBookmarkFetcher,
  bookmarkFetcherName: 'useTpopkontrzaehlEinheitWertesNavData',
}
const apBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useApNavData.js')).useApNavData,
}))
const apHandle = {
  bookmarkFetcher: apBookmarkFetcher,
  bookmarkFetcherName: 'useApNavData',
}
const beobNichtBeurteiltsBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useBeobNichtBeurteiltsNavData.js'))
    .useBeobNichtBeurteiltsNavData,
}))
const beobNichtBeurteiltHandle = {
  bookmarkFetcher: beobNichtBeurteiltsBookmarkFetcher,
  bookmarkFetcherName: 'useBeobNichtBeurteiltsNavData',
}
const beobNichtZuzuordnensBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useBeobNichtZuzuordnensNavData.js'))
    .useBeobNichtBeurteiltsNavData,
}))
const beobNichtZuzuordnenHandle = {
  bookmarkFetcher: beobNichtZuzuordnensBookmarkFetcher,
  bookmarkFetcherName: 'useBeobNichtZuzuordnensNavData',
}
const beobZugeordnetsBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useBeobZugeordnetsNavData.js'))
    .useBeobZugeordnetsNavData,
}))
const beobZugeordnetHandle = {
  bookmarkFetcher: beobZugeordnetsBookmarkFetcher,
  bookmarkFetcherName: 'useBeobZugeordnetsNavData',
}
const popsBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/usePopsNavData.js')).usePopsNavData,
}))
const popsHandle = {
  bookmarkFetcher: popsBookmarkFetcher,
  bookmarkFetcherName: 'usePopsNavData',
}
const zielJahrsBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useZieljahrsNavData.js'))
    .useZieljahrsNavData,
}))
const zielJahrsHandle = {
  bookmarkFetcher: zielJahrsBookmarkFetcher,
  bookmarkFetcherName: 'useZieljahrsNavData',
}
const zielsOfJahrBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useZielsOfJahrNavData.js'))
    .useZielsOfJahrNavData,
}))
const zielsOfJahrHandle = {
  bookmarkFetcher: zielsOfJahrBookmarkFetcher,
  bookmarkFetcherName: 'useZielsOfJahrNavData',
}
const zielBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useZielNavData.js')).useZielNavData,
}))
const zielHandle = {
  bookmarkFetcher: zielBookmarkFetcher,
  bookmarkFetcherName: 'useZielNavData',
}
const zielbersBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useZielbersNavData.js'))
    .useZielbersNavData,
}))
const zielbersHandle = {
  bookmarkFetcher: zielbersBookmarkFetcher,
  bookmarkFetcherName: 'useZielbersNavData',
}
const erfkritsBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useErfkritsNavData.js'))
    .useErfkritsNavData,
}))
const erfkritsHandle = {
  bookmarkFetcher: erfkritsBookmarkFetcher,
  bookmarkFetcherName: 'useErfkritsNavData',
}
const apbersBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useApbersNavData.js')).useApbersNavData,
}))
const apbersHandle = {
  bookmarkFetcher: apbersBookmarkFetcher,
  bookmarkFetcherName: 'useApbersNavData',
}
const apartsBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useApartsNavData.js')).useApartsNavData,
}))
const apartsHandle = {
  bookmarkFetcher: apartsBookmarkFetcher,
  bookmarkFetcherName: 'useApartsNavData',
}
const assozartsBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useAssozartsNavData.js'))
    .useAssozartsNavData,
}))
const assozartsHandle = {
  bookmarkFetcher: assozartsBookmarkFetcher,
  bookmarkFetcherName: 'useAssozartsNavData',
}
const ekfrequenzsBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useEkfrequenzsNavData.js'))
    .useEkfrequenzNavData,
}))
const ekfrequenzsHandle = {
  bookmarkFetcher: ekfrequenzsBookmarkFetcher,
  bookmarkFetcherName: 'useEkfrequenzsNavData',
}
const ekzaehleinheitsBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useEkzaehleinheitsNavData.js'))
    .useEkzaehleinheitsNavData,
}))
const ekzaehleinheitsHandle = {
  bookmarkFetcher: ekzaehleinheitsBookmarkFetcher,
  bookmarkFetcherName: 'useEkzaehleinheitsNavData',
}
const popBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/usePopNavData.js')).usePopNavData,
}))
const popHandle = {
  bookmarkFetcher: popBookmarkFetcher,
  bookmarkFetcherName: 'usePopNavData',
}
const popmassnbersBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/usePopmassnbersNavData.js'))
    .usePopmassnbersNavData,
}))
const popmassnbersHandle = {
  bookmarkFetcher: popmassnbersBookmarkFetcher,
  bookmarkFetcherName: 'usePopmassnbersNavData',
}
const popbersBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/usePopbersNavData.js'))
    .usePopbersNavData,
}))
const popbersHandle = {
  bookmarkFetcher: popbersBookmarkFetcher,
  bookmarkFetcherName: 'usePopbersNavData',
}
const tpopsBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useTpopsNavData.js')).useTpopsNavData,
}))
const tpopsHandle = {
  bookmarkFetcher: tpopsBookmarkFetcher,
  bookmarkFetcherName: 'useTpopsNavData',
}
const tpopBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useTpopNavData.js')).useTpopNavData,
}))
const tpopHandle = {
  bookmarkFetcher: tpopBookmarkFetcher,
  bookmarkFetcherName: 'useTpopNavData',
}
const tpopmassnsBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useTpopmassnsNavData.js'))
    .useTpopmassnsNavData,
}))
const tpopmassnsHandle = {
  bookmarkFetcher: tpopmassnsBookmarkFetcher,
  bookmarkFetcherName: 'useTpopmassnsNavData',
}
import { isDesktopViewAtom } from '../../JotaiStore/index.js'

// WARNING: errorElement did not work
// import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'

import { Unterhalt } from '../Unterhalt.jsx'

// uncomment unterhalt route for Unterhalt
export const Router = () => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        lazy={() => import('../AppBar/index.jsx')}
        hydrateFallbackElement={<Spinner />}
      >
        <Route
          index
          lazy={() => import('../Home/index.jsx')}
        />
        <Route
          path="/Daten"
          lazy={() => import('./ProtectedRoute.jsx')}
          handle={datenHandle}
        >
          <Route
            path="*"
            element={<Unterhalt />}
          ></Route>
        </Route>
      </Route>,
    ),
  )

  return <RouterProvider router={router} />
}
