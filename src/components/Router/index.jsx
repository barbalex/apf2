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
const tpopmassnbersBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useTpopmassnbersNavData.js'))
    .useTpopmassnbersNavData,
}))
const tpopmassnbersHandle = {
  bookmarkFetcher: tpopmassnbersBookmarkFetcher,
  bookmarkFetcherName: 'useTpopmassnbersNavData',
}
const tpopbersBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useTpopbersNavData.js'))
    .useTpopbersNavData,
}))
const tpopbersHandle = {
  bookmarkFetcher: tpopbersBookmarkFetcher,
  bookmarkFetcherName: 'useTpopbersNavData',
}
const tpopfreiwkontrsBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useTpopfreiwkontrsNavData.js'))
    .useTpopfreiwkontrsNavData,
}))
const tpopfreiwkontrsHandle = {
  bookmarkFetcher: tpopfreiwkontrsBookmarkFetcher,
  bookmarkFetcherName: 'useTpopfreiwkontrsNavData',
}
const tpopfeldkontrsBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useTpopfeldkontrsNavData.js'))
    .useTpopfeldkontrsNavData,
}))
const tpopfeldkontrsHandle = {
  bookmarkFetcher: tpopfeldkontrsBookmarkFetcher,
  bookmarkFetcherName: 'useTpopfeldkontrsNavData',
}
const tpopfeldkontrBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useTpopfeldkontrNavData.js'))
    .useTpopfeldkontrNavData,
}))
const tpopfeldkontrHandle = {
  bookmarkFetcher: tpopfeldkontrBookmarkFetcher,
  bookmarkFetcherName: 'useTpopfeldkontrNavData',
}
const tpopfeldkontrzaehlsBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useTpopfeldkontrzaehlsNavData.js'))
    .useTpopfeldkontrzaehlsNavData,
}))
const tpopfeldkontrzaehlsHandle = {
  bookmarkFetcher: tpopfeldkontrzaehlsBookmarkFetcher,
  bookmarkFetcherName: 'useTpopfeldkontrzaehlsNavData',
}
const tpopmassnBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useTpopmassnNavData.js'))
    .useTpopmassnNavData,
}))
const tpopmassnHandle = {
  bookmarkFetcher: tpopmassnBookmarkFetcher,
  bookmarkFetcherName: 'useTpopmassnNavData',
}
const tpopfreiwkontrBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useTpopfreiwkontrNavData.js'))
    .useTpopfreiwkontrNavData,
}))
const tpopfreiwkontrHandle = {
  bookmarkFetcher: tpopfreiwkontrBookmarkFetcher,
  bookmarkFetcherName: 'useTpopfreiwkontrNavData',
}
const idealbiotopBookmarkFetcher = lazy(async () => ({
  default: (await import('../../modules/useIdealbiotopNavData.js'))
    .useIdealbiotopNavData,
}))
const idealbiotopHandle = {
  bookmarkFetcher: idealbiotopBookmarkFetcher,
  bookmarkFetcherName: 'useIdealbiotopNavData',
}
const RouterErrorBoundary = lazy(async () => ({
  default: (await import('../shared/RouterErrorBoundary.jsx'))
    .RouterErrorBoundary,
}))
import { isDesktopViewAtom } from '../../JotaiStore/index.js'

// WARNING: errorElement did not work
// import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'

export const Router = () => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  // TODO: error in dev-tools
  // Cannot update a component (`Unknown`) while rendering a different component (`Unknown`). To locate the bad setState() call inside `Unknown`, follow the stack trace as described in https://react.dev/link/setstate-in-render
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        lazy={() => import('../AppBar/index.jsx')}
        hydrateFallbackElement={<Spinner />}
        errorElement={<RouterErrorBoundary />}
      >
        <Route
          index
          lazy={() => import('../Home/index.jsx')}
          errorElement={<RouterErrorBoundary />}
        />
        <Route
          path="/Daten"
          lazy={() => import('./ProtectedRoute.jsx')}
          handle={datenHandle}
          errorElement={<RouterErrorBoundary />}
        >
          <Route
            path="Projekte/:projId/EK-Planung"
            lazy={() => import('../EkPlan/index.jsx')}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="Benutzer/:userId/EKF/:ekfYear"
            lazy={() => import('../Ekf/index.jsx')}
            errorElement={<RouterErrorBoundary />}
          >
            <Route
              path="*"
              lazy={() => import('../Ekf/index.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path=":ekfId"
              lazy={() => import('../Ekf/index.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
          </Route>
          <Route
            path="*"
            lazy={() => import('../Projekte/index.jsx')}
            errorElement={<RouterErrorBoundary />}
          >
            <Route
              index
              lazy={() => import('../Projekte/Daten/Root/index.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="Werte-Listen"
              handle={wertesHandle}
              errorElement={<RouterErrorBoundary />}
            >
              <Route
                path="*"
                lazy={() => import('../Projekte/Daten/Wertes/index.jsx')}
                errorElement={<RouterErrorBoundary />}
              />
              <Route
                path="Adressen"
                handle={adressesHandle}
                errorElement={<RouterErrorBoundary />}
              >
                <Route
                  path="*"
                  lazy={() => import('../Projekte/Daten/Adresses/index.jsx')}
                  errorElement={<RouterErrorBoundary />}
                />
                <Route
                  path=":adrId"
                  lazy={() => import('../Projekte/Daten/Adresse/index.tsx')}
                  errorElement={<RouterErrorBoundary />}
                />
              </Route>
              <Route
                path="ApberrelevantGrundWerte"
                handle={tpopApberrelevantGrundWertesHandle}
                errorElement={<RouterErrorBoundary />}
              >
                <Route
                  path="*"
                  lazy={() =>
                    import('../Projekte/Daten/TpopApberrelevantGrundWertes/index.jsx')
                  }
                  errorElement={<RouterErrorBoundary />}
                />
                <Route
                  path=":wertId"
                  lazy={() => import('../Projekte/Daten/Werte/index.jsx')}
                  errorElement={<RouterErrorBoundary />}
                />
              </Route>
              <Route
                path="EkAbrechnungstypWerte"
                handle={ekAbrechnungstypWertesHandle}
                errorElement={<RouterErrorBoundary />}
              >
                <Route
                  path="*"
                  lazy={() =>
                    import('../Projekte/Daten/EkAbrechnungstypWertes/index.jsx')
                  }
                  errorElement={<RouterErrorBoundary />}
                />
                <Route
                  path=":wertId"
                  lazy={() => import('../Projekte/Daten/Werte/index.jsx')}
                  errorElement={<RouterErrorBoundary />}
                />
              </Route>
              <Route
                path="TpopkontrzaehlEinheitWerte"
                handle={tpopkontrzaehlEinheitWertesHandle}
                errorElement={<RouterErrorBoundary />}
              >
                <Route
                  path="*"
                  lazy={() =>
                    import('../Projekte/Daten/TpopkontrzaehlEinheitWertes/index.jsx')
                  }
                  errorElement={<RouterErrorBoundary />}
                />
                <Route
                  path=":wertId"
                  lazy={() => import('../Projekte/Daten/Werte/index.jsx')}
                  errorElement={<RouterErrorBoundary />}
                />
              </Route>
            </Route>
            <Route
              path="Mitteilungen"
              lazy={() => import('../Projekte/Daten/Messages/index.jsx')}
              handle={messagesHandle}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="Aktuelle-Fehler"
              handle={currentissuesHandle}
              errorElement={<RouterErrorBoundary />}
            >
              <Route
                path="*"
                lazy={() => import('../Projekte/Daten/CurrentIssues/index.jsx')}
                errorElement={<RouterErrorBoundary />}
              />
              <Route
                path=":issueId"
                lazy={() => import('../Projekte/Daten/CurrentIssue/index.jsx')}
                errorElement={<RouterErrorBoundary />}
              />
            </Route>
            <Route
              path="Projekte"
              handle={projekteHandle}
              errorElement={<RouterErrorBoundary />}
            >
              <Route
                path="*"
                lazy={() => import('../Projekte/Daten/Projects/index.jsx')}
                errorElement={<RouterErrorBoundary />}
              />
              <Route
                path=":projId"
                handle={projektHandle}
                errorElement={<RouterErrorBoundary />}
              >
                <Route
                  path="*"
                  lazy={() => import('../Projekte/Daten/Projekt/index.jsx')}
                  errorElement={<RouterErrorBoundary />}
                />
                <Route
                  path="Projekt"
                  lazy={() => import('../Projekte/Daten/Projekt/Projekt.jsx')}
                  errorElement={<RouterErrorBoundary />}
                />
                <Route
                  path="AP-Berichte"
                  handle={apberuebersichtsHandle}
                  errorElement={<RouterErrorBoundary />}
                >
                  <Route
                    path="*"
                    lazy={() =>
                      import('../Projekte/Daten/Apberuebersichts/index.jsx')
                    }
                    errorElement={<RouterErrorBoundary />}
                  />
                  <Route path=":apberuebersichtId">
                    <Route
                      path="*"
                      lazy={() =>
                        import('../Projekte/Daten/Apberuebersicht/index.tsx')
                      }
                      errorElement={<RouterErrorBoundary />}
                    />
                    <Route
                      path="print"
                      lazy={() => import('../Print/ApberForYear/index.jsx')}
                      errorElement={<RouterErrorBoundary />}
                    />
                  </Route>
                </Route>
                <Route
                  path="Arten"
                  handle={apsHandle}
                  errorElement={<RouterErrorBoundary />}
                >
                  <Route
                    path="*"
                    lazy={() => import('../Projekte/Daten/Aps/index.jsx')}
                    errorElement={<RouterErrorBoundary />}
                  />
                  <Route
                    path=":apId"
                    handle={apHandle}
                    errorElement={<RouterErrorBoundary />}
                  >
                    <Route
                      index={true}
                      lazy={() => import('../Projekte/Daten/Ap/index.jsx')}
                      errorElement={<RouterErrorBoundary />}
                    />
                    <Route
                      path="Art"
                      lazy={() => import('../Projekte/Daten/Ap/Ap.tsx')}
                      errorElement={<RouterErrorBoundary />}
                    />
                    <Route
                      path="Auswertung"
                      lazy={() =>
                        import('../Projekte/Daten/ApAuswertung/index.tsx')
                      }
                      errorElement={<RouterErrorBoundary />}
                    />
                    <Route
                      path="Dateien"
                      lazy={() => import('../Projekte/Daten/Ap/Dateien.jsx')}
                      errorElement={<RouterErrorBoundary />}
                    >
                      <Route
                        index={true}
                        lazy={() => import('../shared/Files/Files/index.jsx')}
                        errorElement={<RouterErrorBoundary />}
                      />
                      <Route path=":fileId">
                        <Route
                          path="*"
                          lazy={() =>
                            import('../shared/Files/Preview/index.jsx')
                          }
                          errorElement={<RouterErrorBoundary />}
                        />
                        <Route
                          path="Vorschau"
                          lazy={() =>
                            import('../shared/Files/Preview/index.jsx')
                          }
                          errorElement={<RouterErrorBoundary />}
                        />
                      </Route>
                    </Route>
                    <Route
                      path="Historien"
                      lazy={() => import('../Projekte/Daten/Ap/Historien.jsx')}
                      errorElement={<RouterErrorBoundary />}
                    />
                    <Route
                      path="AP-Ziele"
                      handle={zielJahrsHandle}
                      errorElement={<RouterErrorBoundary />}
                    >
                      <Route
                        path="*"
                        lazy={() =>
                          import('../Projekte/Daten/Zieljahrs/index.jsx')
                        }
                        errorElement={<RouterErrorBoundary />}
                      />
                      <Route
                        path=":jahr"
                        handle={zielsOfJahrHandle}
                        errorElement={<RouterErrorBoundary />}
                      >
                        <Route
                          path="*"
                          lazy={() =>
                            import('../Projekte/Daten/Ziels/index.jsx')
                          }
                          errorElement={<RouterErrorBoundary />}
                        />
                        <Route
                          path=":zielId"
                          handle={zielHandle}
                          errorElement={<RouterErrorBoundary />}
                        >
                          <Route
                            path="*"
                            lazy={() =>
                              import('../Projekte/Daten/Ziel/index.jsx')
                            }
                            errorElement={<RouterErrorBoundary />}
                          />
                          <Route
                            path="Ziel"
                            lazy={() =>
                              import('../Projekte/Daten/Ziel/Ziel.jsx')
                            }
                            errorElement={<RouterErrorBoundary />}
                          />
                        </Route>
                      </Route>
                    </Route>
                    <Route
                      path="AP-Erfolgskriterien"
                      handle={erfkritsHandle}
                      errorElement={<RouterErrorBoundary />}
                    >
                      <Route
                        path="*"
                        lazy={() =>
                          import('../Projekte/Daten/Erfkrits/index.jsx')
                        }
                        errorElement={<RouterErrorBoundary />}
                      />
                      <Route
                        path=":erfkritId"
                        lazy={() =>
                          import('../Projekte/Daten/Erfkrit/index.jsx')
                        }
                        errorElement={<RouterErrorBoundary />}
                      />
                    </Route>
                    <Route
                      path="AP-Berichte"
                      handle={apbersHandle}
                      errorElement={<RouterErrorBoundary />}
                    >
                      <Route
                        path="*"
                        lazy={() =>
                          import('../Projekte/Daten/Apbers/index.tsx')
                        }
                        errorElement={<RouterErrorBoundary />}
                      />
                      <Route path=":apberId">
                        <Route
                          path="*"
                          lazy={() =>
                            import('../Projekte/Daten/Apber/index.tsx')
                          }
                          errorElement={<RouterErrorBoundary />}
                        />
                        <Route
                          path="print"
                          lazy={() =>
                            import('../Print/ApberForApFromAp/index.jsx')
                          }
                          errorElement={<RouterErrorBoundary />}
                        />
                      </Route>
                    </Route>
                    <Route
                      path="Idealbiotop"
                      handle={idealbiotopHandle}
                      errorElement={<RouterErrorBoundary />}
                    >
                      <Route
                        index={true}
                        lazy={() =>
                          import('../Projekte/Daten/Idealbiotop/index.jsx')
                        }
                        errorElement={<RouterErrorBoundary />}
                      />
                      <Route
                        path="Idealbiotop"
                        lazy={() =>
                          import('../Projekte/Daten/Idealbiotop/Idealbiotop.jsx')
                        }
                        errorElement={<RouterErrorBoundary />}
                      />
                      <Route
                        path="Dateien"
                        lazy={() =>
                          import('../Projekte/Daten/Idealbiotop/Dateien.jsx')
                        }
                        errorElement={<RouterErrorBoundary />}
                      >
                        <Route
                          index={true}
                          lazy={() => import('../shared/Files/Files/index.jsx')}
                          errorElement={<RouterErrorBoundary />}
                        />
                        <Route path=":fileId">
                          <Route
                            path="*"
                            lazy={() =>
                              import('../shared/Files/Preview/index.jsx')
                            }
                            errorElement={<RouterErrorBoundary />}
                          />
                          <Route
                            path="Vorschau"
                            lazy={() =>
                              import('../shared/Files/Preview/index.jsx')
                            }
                            errorElement={<RouterErrorBoundary />}
                          />
                        </Route>
                      </Route>
                    </Route>
                    <Route
                      path="Taxa"
                      handle={apartsHandle}
                      errorElement={<RouterErrorBoundary />}
                    >
                      <Route
                        path="*"
                        lazy={() =>
                          import('../Projekte/Daten/Aparts/index.tsx')
                        }
                        errorElement={<RouterErrorBoundary />}
                      />
                      <Route
                        path=":taxonId"
                        lazy={() => import('../Projekte/Daten/Apart/index.tsx')}
                        errorElement={<RouterErrorBoundary />}
                      />
                    </Route>
                    <Route
                      path="assoziierte-Arten"
                      handle={assozartsHandle}
                      errorElement={<RouterErrorBoundary />}
                    >
                      <Route
                        path="*"
                        lazy={() =>
                          import('../Projekte/Daten/Assozarts/index.jsx')
                        }
                        errorElement={<RouterErrorBoundary />}
                      />
                      <Route
                        path=":assozartId"
                        lazy={() =>
                          import('../Projekte/Daten/Assozart/index.jsx')
                        }
                        errorElement={<RouterErrorBoundary />}
                      />
                    </Route>
                    <Route
                      path="EK-Frequenzen"
                      handle={ekfrequenzsHandle}
                      errorElement={<RouterErrorBoundary />}
                    >
                      <Route
                        path="*"
                        lazy={() =>
                          import('../Projekte/Daten/Ekfrequenzs/index.jsx')
                        }
                        errorElement={<RouterErrorBoundary />}
                      />
                      <Route
                        path=":ekfrequenzId"
                        lazy={() =>
                          import('../Projekte/Daten/Ekfrequenz/index.jsx')
                        }
                        errorElement={<RouterErrorBoundary />}
                      />
                    </Route>
                    <Route
                      path="EK-Zähleinheiten"
                      handle={ekzaehleinheitsHandle}
                      errorElement={<RouterErrorBoundary />}
                    >
                      <Route
                        path="*"
                        lazy={() =>
                          import('../Projekte/Daten/Ekzaehleinheits/index.jsx')
                        }
                        errorElement={<RouterErrorBoundary />}
                      />
                      <Route
                        path=":zaehleinheitId"
                        lazy={() =>
                          import('../Projekte/Daten/Ekzaehleinheit/index.jsx')
                        }
                        errorElement={<RouterErrorBoundary />}
                      />
                    </Route>
                    <Route
                      path="nicht-beurteilte-Beobachtungen"
                      handle={beobNichtBeurteiltHandle}
                      errorElement={<RouterErrorBoundary />}
                    >
                      <Route
                        path="*"
                        lazy={() =>
                          import('../Projekte/Daten/BeobNichtBeurteilts/index.jsx')
                        }
                        errorElement={<RouterErrorBoundary />}
                      />
                      <Route
                        path=":beobId"
                        lazy={() =>
                          import('../Projekte/Daten/Beobzuordnung/index.jsx')
                        }
                        errorElement={<RouterErrorBoundary />}
                      />
                    </Route>
                    <Route
                      path="nicht-zuzuordnende-Beobachtungen"
                      handle={beobNichtZuzuordnenHandle}
                      errorElement={<RouterErrorBoundary />}
                    >
                      <Route
                        path="*"
                        lazy={() =>
                          import('../Projekte/Daten/BeobNichtZuzuordnens/index.jsx')
                        }
                        errorElement={<RouterErrorBoundary />}
                      />
                      <Route
                        path=":beobId"
                        lazy={() =>
                          import('../Projekte/Daten/Beobzuordnung/index.jsx')
                        }
                        errorElement={<RouterErrorBoundary />}
                      />
                    </Route>
                    <Route
                      path="Qualitätskontrollen"
                      lazy={() => import('../Projekte/Daten/Qk/index.jsx')}
                      errorElement={<RouterErrorBoundary />}
                    />
                    <Route
                      path="Qualitätskontrollen-wählen"
                      lazy={() =>
                        import('../Projekte/Daten/Qk/Choose/index.jsx')
                      }
                      errorElement={<RouterErrorBoundary />}
                    />
                    <Route
                      path="Populationen"
                      handle={popsHandle}
                      errorElement={<RouterErrorBoundary />}
                    >
                      <Route
                        path="*"
                        lazy={() => import('../Projekte/Daten/Pops/index.jsx')}
                        errorElement={<RouterErrorBoundary />}
                      />
                      <Route
                        path=":popId"
                        handle={popHandle}
                        errorElement={<RouterErrorBoundary />}
                      >
                        <Route
                          index={true}
                          lazy={() => import('../Projekte/Daten/Pop/index.jsx')}
                          errorElement={<RouterErrorBoundary />}
                        />
                        <Route
                          path="Population"
                          lazy={() => import('../Projekte/Daten/Pop/Pop.jsx')}
                          errorElement={<RouterErrorBoundary />}
                        />
                        <Route
                          path="Auswertung"
                          lazy={() =>
                            import('../Projekte/Daten/PopAuswertung/index.jsx')
                          }
                          errorElement={<RouterErrorBoundary />}
                        />
                        <Route
                          path="Dateien"
                          lazy={() =>
                            import('../Projekte/Daten/Pop/Dateien.jsx')
                          }
                          errorElement={<RouterErrorBoundary />}
                        >
                          <Route
                            index={true}
                            lazy={() =>
                              import('../shared/Files/Files/index.jsx')
                            }
                            errorElement={<RouterErrorBoundary />}
                          />
                          <Route path=":fileId">
                            <Route
                              index={true}
                              lazy={() =>
                                import('../shared/Files/Preview/index.jsx')
                              }
                              errorElement={<RouterErrorBoundary />}
                            />
                            <Route
                              path="Vorschau"
                              lazy={() =>
                                import('../shared/Files/Preview/index.jsx')
                              }
                              errorElement={<RouterErrorBoundary />}
                            />
                          </Route>
                        </Route>
                        <Route
                          path="Historien"
                          lazy={() =>
                            import('../Projekte/Daten/Pop/Historien.jsx')
                          }
                          errorElement={<RouterErrorBoundary />}
                        />
                        <Route
                          path="Teil-Populationen"
                          handle={tpopsHandle}
                          errorElement={<RouterErrorBoundary />}
                        >
                          <Route
                            path="*"
                            lazy={() =>
                              import('../Projekte/Daten/Tpops/index.jsx')
                            }
                            errorElement={<RouterErrorBoundary />}
                          />
                          <Route
                            path=":tpopId"
                            handle={tpopHandle}
                            errorElement={<RouterErrorBoundary />}
                          >
                            <Route
                              index={true}
                              lazy={() =>
                                import('../Projekte/Daten/Tpop/index.jsx')
                              }
                              errorElement={<RouterErrorBoundary />}
                            />
                            <Route
                              path="Teil-Population"
                              lazy={() =>
                                import('../Projekte/Daten/Tpop/Tpop.jsx')
                              }
                              errorElement={<RouterErrorBoundary />}
                            />
                            <Route
                              path="EK"
                              lazy={() =>
                                import('../Projekte/Daten/TpopEk/index.jsx')
                              }
                              errorElement={<RouterErrorBoundary />}
                            />
                            <Route
                              path="Dateien"
                              lazy={() =>
                                import('../Projekte/Daten/Tpop/Dateien.jsx')
                              }
                              errorElement={<RouterErrorBoundary />}
                            >
                              <Route
                                index={true}
                                lazy={() =>
                                  import('../shared/Files/Files/index.jsx')
                                }
                                errorElement={<RouterErrorBoundary />}
                              />
                              <Route path=":fileId">
                                <Route
                                  path="*"
                                  lazy={() =>
                                    import('../shared/Files/Preview/index.jsx')
                                  }
                                  errorElement={<RouterErrorBoundary />}
                                />
                                <Route
                                  path="Vorschau"
                                  lazy={() =>
                                    import('../shared/Files/Preview/index.jsx')
                                  }
                                  errorElement={<RouterErrorBoundary />}
                                />
                              </Route>
                            </Route>
                            <Route
                              path="Historien"
                              lazy={() =>
                                import('../Projekte/Daten/Tpop/Historien.jsx')
                              }
                              errorElement={<RouterErrorBoundary />}
                            />
                            <Route
                              path="Massnahmen"
                              handle={tpopmassnsHandle}
                              errorElement={<RouterErrorBoundary />}
                            >
                              <Route
                                path="*"
                                lazy={() =>
                                  import('../Projekte/Daten/Tpopmassns/index.jsx')
                                }
                                errorElement={<RouterErrorBoundary />}
                              />
                              <Route
                                path=":tpopmassnId"
                                handle={tpopmassnHandle}
                                errorElement={<RouterErrorBoundary />}
                              >
                                <Route
                                  path="*"
                                  lazy={() =>
                                    import('../Projekte/Daten/Tpopmassn/index.jsx')
                                  }
                                  errorElement={<RouterErrorBoundary />}
                                />
                                <Route
                                  path="Massnahme"
                                  lazy={() =>
                                    import('../Projekte/Daten/Tpopmassn/Tpopmassn.jsx')
                                  }
                                  errorElement={<RouterErrorBoundary />}
                                />
                                <Route
                                  path="Dateien"
                                  lazy={() =>
                                    import('../Projekte/Daten/Tpopmassn/Dateien.jsx')
                                  }
                                  errorElement={<RouterErrorBoundary />}
                                >
                                  <Route
                                    index={true}
                                    lazy={() =>
                                      import('../shared/Files/Files/index.jsx')
                                    }
                                    errorElement={<RouterErrorBoundary />}
                                  />
                                  <Route path=":fileId">
                                    <Route
                                      path="*"
                                      lazy={() =>
                                        import('../shared/Files/Preview/index.jsx')
                                      }
                                      errorElement={<RouterErrorBoundary />}
                                    />
                                    <Route
                                      path="Vorschau"
                                      lazy={() =>
                                        import('../shared/Files/Preview/index.jsx')
                                      }
                                      errorElement={<RouterErrorBoundary />}
                                    />
                                  </Route>
                                </Route>
                              </Route>
                            </Route>
                            <Route
                              path="Massnahmen-Berichte"
                              handle={tpopmassnbersHandle}
                              errorElement={<RouterErrorBoundary />}
                            >
                              <Route
                                path="*"
                                lazy={() =>
                                  import('../Projekte/Daten/Tpopmassnbers/index.jsx')
                                }
                                errorElement={<RouterErrorBoundary />}
                              />
                              <Route
                                path=":tpopmassnberId"
                                lazy={() =>
                                  import('../Projekte/Daten/Tpopmassnber/index.jsx')
                                }
                                errorElement={<RouterErrorBoundary />}
                              />
                            </Route>
                            <Route
                              path="Feld-Kontrollen"
                              handle={tpopfeldkontrsHandle}
                              errorElement={<RouterErrorBoundary />}
                            >
                              <Route
                                path="*"
                                lazy={() =>
                                  import('../Projekte/Daten/Tpopfeldkontrs/index.jsx')
                                }
                                errorElement={<RouterErrorBoundary />}
                              />
                              <Route
                                path=":tpopkontrId"
                                handle={tpopfeldkontrHandle}
                                errorElement={<RouterErrorBoundary />}
                              >
                                <Route
                                  index={true}
                                  lazy={() =>
                                    import('../Projekte/Daten/Tpopfeldkontr/index.jsx')
                                  }
                                  errorElement={<RouterErrorBoundary />}
                                />
                                <Route
                                  path="Feld-Kontrolle"
                                  lazy={() =>
                                    import('../Projekte/Daten/Tpopfeldkontr/Tpopfeldkontr.jsx')
                                  }
                                  errorElement={<RouterErrorBoundary />}
                                />
                                <Route
                                  path="Teil-Population"
                                  lazy={() =>
                                    import('../Projekte/Daten/Tpopfeldkontr/index.jsx')
                                  }
                                  errorElement={<RouterErrorBoundary />}
                                />
                                <Route
                                  path="Biotop"
                                  lazy={() =>
                                    import('../Projekte/Daten/Tpopfeldkontr/Biotop.jsx')
                                  }
                                  errorElement={<RouterErrorBoundary />}
                                />
                                <Route
                                  path="Dateien"
                                  lazy={() =>
                                    import('../Projekte/Daten/Tpopfeldkontr/Dateien.jsx')
                                  }
                                  errorElement={<RouterErrorBoundary />}
                                >
                                  <Route
                                    index={true}
                                    lazy={() =>
                                      import('../shared/Files/Files/index.jsx')
                                    }
                                    errorElement={<RouterErrorBoundary />}
                                  />
                                  <Route path=":fileId">
                                    <Route
                                      path="*"
                                      lazy={() =>
                                        import('../shared/Files/Preview/index.jsx')
                                      }
                                      errorElement={<RouterErrorBoundary />}
                                    />
                                    <Route
                                      path="Vorschau"
                                      lazy={() =>
                                        import('../shared/Files/Preview/index.jsx')
                                      }
                                      errorElement={<RouterErrorBoundary />}
                                    />
                                  </Route>
                                </Route>
                                <Route
                                  path="Zaehlungen"
                                  handle={tpopfeldkontrzaehlsHandle}
                                  errorElement={<RouterErrorBoundary />}
                                >
                                  <Route
                                    path="*"
                                    lazy={() =>
                                      import('../Projekte/Daten/Tpopkontrzaehls/index.jsx')
                                    }
                                    errorElement={<RouterErrorBoundary />}
                                  />
                                  <Route
                                    path=":tpopkontrzaehlId"
                                    lazy={() =>
                                      import('../Projekte/Daten/Tpopkontrzaehl/index.jsx')
                                    }
                                    errorElement={<RouterErrorBoundary />}
                                  />
                                </Route>
                              </Route>
                            </Route>
                            <Route
                              path="Freiwilligen-Kontrollen"
                              handle={tpopfreiwkontrsHandle}
                              errorElement={<RouterErrorBoundary />}
                            >
                              <Route
                                path="*"
                                lazy={() =>
                                  import('../Projekte/Daten/Tpopfreiwkontrs/index.jsx')
                                }
                                errorElement={<RouterErrorBoundary />}
                              />
                              <Route
                                path=":tpopkontrId"
                                handle={tpopfreiwkontrHandle}
                                errorElement={<RouterErrorBoundary />}
                              >
                                <Route
                                  path="*"
                                  lazy={() =>
                                    import('../Projekte/Daten/Tpopfreiwkontr/index.jsx')
                                  }
                                  errorElement={<RouterErrorBoundary />}
                                />
                                <Route
                                  path="Freiwilligen-Kontrolle"
                                  lazy={() =>
                                    import('../Projekte/Daten/Tpopfreiwkontr/Tpopfreiwkontr.jsx')
                                  }
                                  errorElement={<RouterErrorBoundary />}
                                />
                                <Route
                                  path="Dateien"
                                  lazy={() =>
                                    import('../Projekte/Daten/Tpopfeldkontr/Dateien.jsx')
                                  }
                                  errorElement={<RouterErrorBoundary />}
                                >
                                  <Route
                                    index={true}
                                    lazy={() =>
                                      import('../shared/Files/Files/index.jsx')
                                    }
                                    errorElement={<RouterErrorBoundary />}
                                  />
                                  <Route path=":fileId">
                                    <Route
                                      path="*"
                                      lazy={() =>
                                        import('../shared/Files/Preview/index.jsx')
                                      }
                                      errorElement={<RouterErrorBoundary />}
                                    />
                                    <Route
                                      path="Vorschau"
                                      lazy={() =>
                                        import('../shared/Files/Preview/index.jsx')
                                      }
                                      errorElement={<RouterErrorBoundary />}
                                    />
                                  </Route>
                                </Route>
                              </Route>
                            </Route>
                            <Route
                              path="Kontroll-Berichte"
                              handle={tpopbersHandle}
                              errorElement={<RouterErrorBoundary />}
                            >
                              <Route
                                path="*"
                                lazy={() =>
                                  import('../Projekte/Daten/Tpopbers/index.jsx')
                                }
                                errorElement={<RouterErrorBoundary />}
                              />
                              <Route
                                path=":tpopberId"
                                lazy={() =>
                                  import('../Projekte/Daten/Tpopber/index.jsx')
                                }
                                errorElement={<RouterErrorBoundary />}
                              />
                            </Route>
                            <Route
                              path="Beobachtungen"
                              handle={beobZugeordnetHandle}
                              errorElement={<RouterErrorBoundary />}
                            >
                              <Route
                                path="*"
                                lazy={() =>
                                  import('../Projekte/Daten/BeobZugeordnets/index.jsx')
                                }
                                errorElement={<RouterErrorBoundary />}
                              />
                              <Route
                                path=":beobId"
                                lazy={() =>
                                  import('../Projekte/Daten/Beobzuordnung/index.jsx')
                                }
                                errorElement={<RouterErrorBoundary />}
                              />
                            </Route>
                          </Route>
                        </Route>
                        <Route
                          path="Kontroll-Berichte"
                          handle={popbersHandle}
                          errorElement={<RouterErrorBoundary />}
                        >
                          <Route
                            path="*"
                            lazy={() =>
                              import('../Projekte/Daten/Popbers/index.jsx')
                            }
                            errorElement={<RouterErrorBoundary />}
                          />
                          <Route
                            path=":popberId"
                            lazy={() =>
                              import('../Projekte/Daten/Popber/index.jsx')
                            }
                            errorElement={<RouterErrorBoundary />}
                          />
                        </Route>
                        <Route
                          path="Massnahmen-Berichte"
                          handle={popmassnbersHandle}
                          errorElement={<RouterErrorBoundary />}
                        >
                          <Route
                            path="*"
                            lazy={() =>
                              import('../Projekte/Daten/Popmassnbers/index.jsx')
                            }
                            errorElement={<RouterErrorBoundary />}
                          />
                          <Route
                            path=":popmassnberId"
                            lazy={() =>
                              import('../Projekte/Daten/Popmassnber/index.jsx')
                            }
                            errorElement={<RouterErrorBoundary />}
                          />
                        </Route>
                      </Route>
                    </Route>
                  </Route>
                </Route>
              </Route>
            </Route>
            <Route
              path="Benutzer"
              handle={usersHandle}
              errorElement={<RouterErrorBoundary />}
            >
              <Route
                path="*"
                lazy={() => import('../Projekte/Daten/Users/index.jsx')}
                errorElement={<RouterErrorBoundary />}
              />
              <Route path=":userId">
                <Route
                  path="*"
                  lazy={() => import('../Projekte/Daten/User/index.jsx')}
                  errorElement={<RouterErrorBoundary />}
                />
                <Route path="EKF">
                  <Route
                    path="*"
                    lazy={() => import('./EkfYearNavigator.jsx')}
                    errorElement={<RouterErrorBoundary />}
                  />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
        <Route
          path="Dokumentation"
          lazy={() =>
            isDesktopView ? import('../Docs/DesktopDocs.jsx') : null
          }
          errorElement={<RouterErrorBoundary />}
        >
          <Route
            index={true}
            lazy={() => import('../Docs/index.jsx')}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="*"
            lazy={() =>
              isDesktopView ?
                import('../Docs/DesktopDoc.jsx')
              : import('../Docs/MobileDoc.jsx')
            }
            errorElement={<RouterErrorBoundary />}
          >
            <Route
              path="was-kann-man-mit-apflora-machen"
              lazy={() => import('../Docs/docs/WasKannApflora.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="technische-voraussetzungen"
              lazy={() => import('../Docs/docs/TechnischeVoraussetzungen.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="tipps-fuer-den-einstieg"
              lazy={() => import('../Docs/docs/TippsFuerDenEinstieg.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="videos-fuer-den-einstieg"
              lazy={() => import('../Docs/docs/VideosFuerDenEinstieg.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="anleitung-eingabe"
              lazy={() => import('../Docs/docs/AnleitungZurEingabe.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="navigation"
              lazy={() => import('../Docs/docs/Navigation/index.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="ist-apflora-langsam"
              lazy={() => import('../Docs/docs/IstApfloraLangsam.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="art-auswertung-pop-menge"
              lazy={() => import('../Docs/docs/ArtAuswertungPopMenge.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="beobachtungen-einer-teil-population-zuordnen"
              lazy={() => import('../Docs/docs/BeobZuordnen/index.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="falsch-bestimmte-beobachtungen"
              lazy={() => import('../Docs/docs/FalschBestimmteBeob.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="erfolgs-kontrollen-planen"
              lazy={() => import('../Docs/docs/EkPlanen/index.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="benutzer-konti"
              lazy={() => import('../Docs/docs/BenutzerKonti.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="erfolgs-kontrollen-freiwillige"
              lazy={() => import('../Docs/docs/Ekf.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="filter"
              lazy={() => import('../Docs/docs/Filter/index.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="markdown"
              lazy={() => import('../Docs/docs/Markdown/index.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="historisierung"
              lazy={() => import('../Docs/docs/Historisierung.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="karte-teil-populationen-aller-arten-anzeigen"
              lazy={() => import('../Docs/docs/KarteTpopAllerArten.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="karte-filter"
              lazy={() => import('../Docs/docs/KarteFilter.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="karte-symbole-und-label-fuer-populationen-und-teil-populationen-waehlen"
              lazy={() =>
                import('../Docs/docs/KartePopTpopIconsLabelWaehlen/index.jsx')
              }
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="karte-massstab"
              lazy={() => import('../Docs/docs/KarteMassstab/index.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="karte-drucken"
              lazy={() => import('../Docs/docs/KarteDrucken.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="gedaechtnis"
              lazy={() => import('../Docs/docs/Gedaechtnis.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="dateien"
              lazy={() => import('../Docs/docs/Dateien/index.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="koordinaten"
              lazy={() => import('../Docs/docs/Koordinaten/index.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="melden"
              lazy={() => import('../Docs/docs/Melden.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="pwa"
              lazy={() => import('../Docs/docs/Pwa/index.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="technologien"
              lazy={() => import('../Docs/docs/Technologien/index.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="beobachtungen-verwalten"
              lazy={() => import('../Docs/docs/BeobVerwalten/index.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="produkte-fuer-die-fns"
              lazy={() => import('../Docs/docs/ProdukteFuerFNS.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="daten-sichern"
              lazy={() => import('../Docs/docs/DatenSichern.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="daten-wiederherstellen"
              lazy={() => import('../Docs/docs/DatenWiederherstellen.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="testen"
              lazy={() => import('../Docs/docs/Testen.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="geschichte"
              lazy={() => import('../Docs/docs/Geschichte.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="open-source"
              lazy={() => import('../Docs/docs/OpenSource.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="art-taxonomien-ergaenzen"
              lazy={() => import('../Docs/docs/ArtTaxonomieErgaenzen.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="info-flora-export"
              lazy={() => import('../Docs/docs/InfofloraExport.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path="*"
              lazy={() => import('../404.jsx')}
              errorElement={<RouterErrorBoundary />}
            />
          </Route>
        </Route>
        <Route
          path="*"
          lazy={() => import('../404.jsx')}
        />
      </Route>,
    ),
  )

  return <RouterProvider router={router} />
}
