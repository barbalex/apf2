import { lazy } from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router'
import { RouterProvider } from 'react-router/dom'

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

// WARNING: errorElement did not work
// import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'

// import { Unterhalt } from './components/Unterhalt.jsx'

// uncomment unterhalt route for Unterhalt
export const Router = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route lazy={() => import('../AppBar/index.jsx')}>
        <Route
          index
          lazy={() => import('../Home/index.jsx')}
        />
        <Route
          path="/Daten"
          lazy={() => import('./ProtectedRoute.jsx')}
          handle={datenHandle}
        >
          {/* <Route path="*" element={<Unterhalt />}></Route> */}
          <Route
            path="Projekte/:projId/EK-Planung"
            lazy={() => import('../EkPlan/index.jsx')}
          />
          <Route
            path="Benutzer/:userId/EKF/:ekfYear"
            lazy={() => import('../Ekf/index.jsx')}
          >
            <Route
              path="*"
              lazy={() => import('../Ekf/index.jsx')}
            />
            <Route
              path=":ekfId"
              lazy={() => import('../Ekf/index.jsx')}
            />
          </Route>
          <Route
            path="*"
            lazy={() => import('../Projekte/index.jsx')}
          >
            <Route
              index
              lazy={() => import('../Projekte/Daten/Root/index.jsx')}
            />
            <Route
              path="Werte-Listen"
              handle={wertesHandle}
            >
              <Route
                path="*"
                lazy={() => import('../Projekte/Daten/Wertes/index.jsx')}
              />
              <Route
                path="Adressen"
                handle={adressesHandle}
              >
                <Route
                  path="*"
                  lazy={() => import('../Projekte/Daten/Adresses/index.jsx')}
                />
                <Route
                  path=":adrId"
                  lazy={() => import('../Projekte/Daten/Adresse/index.jsx')}
                />
              </Route>
              <Route
                path="ApberrelevantGrundWerte"
                handle={tpopApberrelevantGrundWertesHandle}
              >
                <Route
                  path="*"
                  lazy={() =>
                    import(
                      '../Projekte/Daten/TpopApberrelevantGrundWertes/index.jsx'
                    )
                  }
                />
                <Route
                  path=":wertId"
                  lazy={() => import('../Projekte/Daten/Werte/index.jsx')}
                />
              </Route>
              <Route
                path="EkAbrechnungstypWerte"
                handle={ekAbrechnungstypWertesHandle}
              >
                <Route
                  path="*"
                  lazy={() =>
                    import('../Projekte/Daten/EkAbrechnungstypWertes/index.jsx')
                  }
                />
                <Route
                  path=":wertId"
                  lazy={() => import('../Projekte/Daten/Werte/index.jsx')}
                />
              </Route>
              <Route
                path="TpopkontrzaehlEinheitWerte"
                handle={tpopkontrzaehlEinheitWertesHandle}
              >
                <Route
                  path="*"
                  lazy={() =>
                    import(
                      '../Projekte/Daten/TpopkontrzaehlEinheitWertes/index.jsx'
                    )
                  }
                />
                <Route
                  path=":wertId"
                  lazy={() => import('../Projekte/Daten/Werte/index.jsx')}
                />
              </Route>
            </Route>
            <Route
              path="Mitteilungen"
              lazy={() => import('../Projekte/Daten/Messages/index.jsx')}
              handle={messagesHandle}
            />
            <Route
              path="Aktuelle-Fehler"
              handle={currentissuesHandle}
            >
              <Route
                path="*"
                lazy={() => import('../Projekte/Daten/CurrentIssues/index.jsx')}
              />
              <Route
                path=":issueId"
                lazy={() => import('../Projekte/Daten/CurrentIssue/index.jsx')}
              />
            </Route>
            <Route
              path="Projekte"
              handle={projekteHandle}
            >
              <Route
                path="*"
                lazy={() => import('../Projekte/Daten/Projects/index.jsx')}
              />
              <Route
                path=":projId"
                handle={projektHandle}
              >
                <Route
                  path="*"
                  lazy={() => import('../Projekte/Daten/Projekt/index.jsx')}
                />
                <Route
                  path="AP-Berichte"
                  handle={apberuebersichtsHandle}
                >
                  <Route
                    path="*"
                    lazy={() =>
                      import('../Projekte/Daten/Apberuebersichts/index.jsx')
                    }
                  />
                  <Route path=":apberUebersichtId">
                    <Route
                      path="*"
                      lazy={() =>
                        import('../Projekte/Daten/Apberuebersicht/index.jsx')
                      }
                    />
                    <Route
                      path="print"
                      lazy={() => import('../Print/ApberForYear/index.jsx')}
                    />
                  </Route>
                </Route>
                <Route
                  path="Arten"
                  handle={apsHandle}
                >
                  <Route
                    path="*"
                    lazy={() => import('../Projekte/Daten/Aps/index.jsx')}
                  />
                  <Route
                    path=":apId"
                    handle={apHandle}
                  >
                    <Route
                      index={true}
                      lazy={() => import('../Projekte/Daten/Ap/index.jsx')}
                    />
                    <Route
                      path="Art"
                      lazy={() => import('../Projekte/Daten/Ap/index.jsx')}
                    />
                    <Route
                      path="Auswertung"
                      lazy={() =>
                        import('../Projekte/Daten/ApAuswertung/index.jsx')
                      }
                    />
                    <Route
                      path="Dateien"
                      lazy={() => import('../Projekte/Daten/Ap/Dateien.jsx')}
                    >
                      <Route
                        index={true}
                        lazy={() => import('../shared/Files/Files/index.jsx')}
                      />
                      <Route path=":fileId">
                        <Route
                          path="*"
                          lazy={() =>
                            import('../shared/Files/Preview/index.jsx')
                          }
                        />
                        <Route
                          path="Vorschau"
                          lazy={() =>
                            import('../shared/Files/Preview/index.jsx')
                          }
                        />
                      </Route>
                    </Route>
                    <Route
                      path="Historien"
                      lazy={() => import('../Projekte/Daten/Ap/Historien.jsx')}
                    />
                    <Route
                      path="AP-Ziele"
                      handle={zielJahrsHandle}
                    >
                      <Route
                        path="*"
                        lazy={() =>
                          import('../Projekte/Daten/Zieljahrs/index.jsx')
                        }
                      />
                      <Route
                        path=":jahr"
                        handle={zielsOfJahrHandle}
                      >
                        <Route
                          path="*"
                          lazy={() =>
                            import('../Projekte/Daten/Ziels/index.jsx')
                          }
                        />
                        <Route
                          path=":zielId"
                          handle={zielHandle}
                        >
                          <Route
                            path="*"
                            lazy={() =>
                              import('../Projekte/Daten/Ziel/index.jsx')
                            }
                          />
                          <Route
                            path="Berichte"
                            handle={zielbersHandle}
                          >
                            <Route
                              path="*"
                              lazy={() =>
                                import('../Projekte/Daten/Zielbers/index.jsx')
                              }
                            />
                            <Route
                              path=":zielberId"
                              lazy={() =>
                                import('../Projekte/Daten/Zielber/index.jsx')
                              }
                            />
                          </Route>
                        </Route>
                      </Route>
                    </Route>
                    <Route
                      path="AP-Erfolgskriterien"
                      handle={erfkritsHandle}
                    >
                      <Route
                        path="*"
                        lazy={() =>
                          import('../Projekte/Daten/Erfkrits/index.jsx')
                        }
                      />
                      <Route
                        path=":erfkritId"
                        lazy={() =>
                          import('../Projekte/Daten/Erfkrit/index.jsx')
                        }
                      />
                    </Route>
                    <Route
                      path="AP-Berichte"
                      handle={apbersHandle}
                    >
                      <Route
                        path="*"
                        lazy={() =>
                          import('../Projekte/Daten/Apbers/index.jsx')
                        }
                      />
                      <Route path=":apberId">
                        <Route
                          path="*"
                          lazy={() =>
                            import('../Projekte/Daten/Apber/index.jsx')
                          }
                        />
                        <Route
                          path="print"
                          lazy={() =>
                            import('../Print/ApberForApFromAp/index.jsx')
                          }
                        />
                      </Route>
                    </Route>
                    <Route
                      path="Idealbiotop"
                      lazy={() =>
                        import('../Projekte/Daten/IdealbiotopRouter/index.jsx')
                      }
                    >
                      <Route
                        index={true}
                        lazy={() =>
                          import('../Projekte/Daten/Idealbiotop/index.jsx')
                        }
                      />
                      <Route
                        path="Idealbiotop"
                        lazy={() =>
                          import('../Projekte/Daten/Idealbiotop/index.jsx')
                        }
                      />
                      <Route
                        path="Dateien"
                        lazy={() =>
                          import('../Projekte/Daten/Idealbiotop/Dateien.jsx')
                        }
                      >
                        <Route
                          index={true}
                          lazy={() => import('../shared/Files/Files/index.jsx')}
                        />
                        <Route path=":fileId">
                          <Route
                            path="*"
                            lazy={() =>
                              import('../shared/Files/Preview/index.jsx')
                            }
                          />
                          <Route
                            path="Vorschau"
                            lazy={() =>
                              import('../shared/Files/Preview/index.jsx')
                            }
                          />
                        </Route>
                      </Route>
                    </Route>
                    <Route
                      path="Taxa"
                      handle={apartsHandle}
                    >
                      <Route
                        path="*"
                        lazy={() =>
                          import('../Projekte/Daten/Aparts/index.jsx')
                        }
                      />
                      <Route
                        path=":taxonId"
                        lazy={() => import('../Projekte/Daten/Apart/index.jsx')}
                      />
                    </Route>
                    <Route
                      path="assoziierte-Arten"
                      handle={assozartsHandle}
                    >
                      <Route
                        path="*"
                        lazy={() =>
                          import('../Projekte/Daten/Assozarts/index.jsx')
                        }
                      />
                      <Route
                        path=":assozartId"
                        lazy={() =>
                          import('../Projekte/Daten/Assozart/index.jsx')
                        }
                      />
                    </Route>
                    <Route
                      path="EK-Frequenzen"
                      handle={ekfrequenzsHandle}
                    >
                      <Route
                        path="*"
                        lazy={() =>
                          import('../Projekte/Daten/Ekfrequenzs/index.jsx')
                        }
                      />
                      <Route
                        path=":ekfrequenzId"
                        lazy={() =>
                          import('../Projekte/Daten/Ekfrequenz/index.jsx')
                        }
                      />
                    </Route>
                    <Route
                      path="EK-Zähleinheiten"
                      handle={ekzaehleinheitsHandle}
                    >
                      <Route
                        path="*"
                        lazy={() =>
                          import('../Projekte/Daten/Ekzaehleinheits/index.jsx')
                        }
                      />
                      <Route
                        path=":zaehleinheitId"
                        lazy={() =>
                          import('../Projekte/Daten/Ekzaehleinheit/index.jsx')
                        }
                      />
                    </Route>
                    <Route
                      path="nicht-beurteilte-Beobachtungen"
                      handle={beobNichtBeurteiltHandle}
                    >
                      <Route
                        path="*"
                        lazy={() =>
                          import(
                            '../Projekte/Daten/BeobNichtBeurteilts/index.jsx'
                          )
                        }
                      />
                      <Route
                        path=":beobId"
                        lazy={() =>
                          import('../Projekte/Daten/Beobzuordnung/index.jsx')
                        }
                      />
                    </Route>
                    <Route
                      path="nicht-zuzuordnende-Beobachtungen"
                      handle={beobNichtZuzuordnenHandle}
                    >
                      <Route
                        path="*"
                        lazy={() =>
                          import(
                            '../Projekte/Daten/BeobNichtZuzuordnens/index.jsx'
                          )
                        }
                      />
                      <Route
                        path=":beobId"
                        lazy={() =>
                          import('../Projekte/Daten/Beobzuordnung/index.jsx')
                        }
                      />
                    </Route>
                    <Route
                      path="Qualitaetskontrollen"
                      lazy={() =>
                        import('../Projekte/Daten/QkRouter/index.jsx')
                      }
                    >
                      <Route
                        index={true}
                        lazy={() => import('../Projekte/Daten/Qk/index.jsx')}
                      />
                      <Route
                        path="ausfuehren"
                        lazy={() => import('../Projekte/Daten/Qk/index.jsx')}
                      />
                      <Route
                        path="waehlen"
                        lazy={() =>
                          import('../Projekte/Daten/Qk/Choose/index.jsx')
                        }
                      />
                    </Route>
                    <Route
                      path="Populationen"
                      handle={popsHandle}
                    >
                      <Route
                        path="*"
                        lazy={() => import('../Projekte/Daten/Pops/index.jsx')}
                      />
                      <Route
                        path=":popId"
                        handle={popHandle}
                      >
                        <Route
                          index={true}
                          lazy={() => import('../Projekte/Daten/Pop/index.jsx')}
                        />
                        <Route
                          path="Population"
                          lazy={() => import('../Projekte/Daten/Pop/index.jsx')}
                        />
                        <Route
                          path="Auswertung"
                          lazy={() =>
                            import('../Projekte/Daten/PopAuswertung/index.jsx')
                          }
                        />
                        <Route
                          path="Dateien"
                          lazy={() =>
                            import('../Projekte/Daten/Pop/Dateien.jsx')
                          }
                        >
                          <Route
                            index={true}
                            lazy={() =>
                              import('../shared/Files/Files/index.jsx')
                            }
                          />
                          <Route path=":fileId">
                            <Route
                              index={true}
                              lazy={() =>
                                import('../shared/Files/Preview/index.jsx')
                              }
                            />
                            <Route
                              path="Vorschau"
                              lazy={() =>
                                import('../shared/Files/Preview/index.jsx')
                              }
                            />
                          </Route>
                        </Route>
                        <Route
                          path="Historien"
                          lazy={() =>
                            import('../Projekte/Daten/Pop/Historien.jsx')
                          }
                        />
                        <Route
                          path="Teil-Populationen"
                          handle={tpopsHandle}
                        >
                          <Route
                            path="*"
                            lazy={() =>
                              import('../Projekte/Daten/Tpops/index.jsx')
                            }
                          />
                          <Route
                            path=":tpopId"
                            handle={tpopHandle}
                          >
                            <Route
                              index={true}
                              lazy={() =>
                                import('../Projekte/Daten/Tpop/index.jsx')
                              }
                            />
                            <Route
                              path="Teil-Population"
                              lazy={() =>
                                import('../Projekte/Daten/Tpop/index.jsx')
                              }
                            />
                            <Route
                              path="EK"
                              lazy={() =>
                                import('../Projekte/Daten/TpopEk/index.jsx')
                              }
                            />
                            <Route
                              path="Dateien"
                              lazy={() =>
                                import('../Projekte/Daten/Tpop/Dateien.jsx')
                              }
                            >
                              <Route
                                index={true}
                                lazy={() =>
                                  import('../shared/Files/Files/index.jsx')
                                }
                              />
                              <Route path=":fileId">
                                <Route
                                  path="*"
                                  lazy={() =>
                                    import('../shared/Files/Preview/index.jsx')
                                  }
                                />
                                <Route
                                  path="Vorschau"
                                  lazy={() =>
                                    import('../shared/Files/Preview/index.jsx')
                                  }
                                />
                              </Route>
                            </Route>
                            <Route
                              path="Historien"
                              lazy={() =>
                                import('../Projekte/Daten/Tpop/Historien.jsx')
                              }
                            />
                            <Route
                              path="Massnahmen"
                              handle={tpopmassnsHandle}
                            >
                              <Route
                                path="*"
                                lazy={() =>
                                  import(
                                    '../Projekte/Daten/Tpopmassns/index.jsx'
                                  )
                                }
                              />
                              <Route
                                path=":tpopmassnId"
                                handle={tpopmassnHandle}
                              >
                                <Route
                                  index={true}
                                  lazy={() =>
                                    import(
                                      '../Projekte/Daten/Tpopmassn/index.jsx'
                                    )
                                  }
                                />
                                <Route
                                  path="Massnahme"
                                  lazy={() =>
                                    import(
                                      '../Projekte/Daten/Tpopmassn/index.jsx'
                                    )
                                  }
                                />
                                <Route
                                  path="Dateien"
                                  lazy={() =>
                                    import(
                                      '../Projekte/Daten/Tpopmassn/Dateien.jsx'
                                    )
                                  }
                                >
                                  <Route
                                    index={true}
                                    lazy={() =>
                                      import('../shared/Files/Files/index.jsx')
                                    }
                                  />
                                  <Route path=":fileId">
                                    <Route
                                      path="*"
                                      lazy={() =>
                                        import(
                                          '../shared/Files/Preview/index.jsx'
                                        )
                                      }
                                    />
                                    <Route
                                      path="Vorschau"
                                      lazy={() =>
                                        import(
                                          '../shared/Files/Preview/index.jsx'
                                        )
                                      }
                                    />
                                  </Route>
                                </Route>
                              </Route>
                            </Route>
                            <Route
                              path="Massnahmen-Berichte"
                              handle={tpopmassnbersHandle}
                            >
                              <Route
                                path="*"
                                lazy={() =>
                                  import(
                                    '../Projekte/Daten/Tpopmassnbers/index.jsx'
                                  )
                                }
                              />
                              <Route
                                path=":tpopmassnberId"
                                lazy={() =>
                                  import(
                                    '../Projekte/Daten/Tpopmassnber/index.jsx'
                                  )
                                }
                              />
                            </Route>
                            <Route
                              path="Feld-Kontrollen"
                              handle={tpopfeldkontrsHandle}
                            >
                              <Route
                                path="*"
                                lazy={() =>
                                  import(
                                    '../Projekte/Daten/Tpopfeldkontrs/index.jsx'
                                  )
                                }
                              />
                              <Route
                                path=":tpopkontrId"
                                handle={tpopfeldkontrHandle}
                              >
                                <Route
                                  index={true}
                                  lazy={() =>
                                    import(
                                      '../Projekte/Daten/Tpopfeldkontr/index.jsx'
                                    )
                                  }
                                />
                                <Route
                                  path="Entwicklung"
                                  lazy={() =>
                                    import(
                                      '../Projekte/Daten/Tpopfeldkontr/index.jsx'
                                    )
                                  }
                                />
                                <Route
                                  path="Teil-Population"
                                  lazy={() =>
                                    import(
                                      '../Projekte/Daten/Tpopfeldkontr/index.jsx'
                                    )
                                  }
                                />
                                <Route
                                  path="Biotop"
                                  lazy={() =>
                                    import(
                                      '../Projekte/Daten/Tpopfeldkontr/Biotop.jsx'
                                    )
                                  }
                                />
                                <Route
                                  path="Dateien"
                                  lazy={() =>
                                    import(
                                      '../Projekte/Daten/Tpopfeldkontr/Dateien.jsx'
                                    )
                                  }
                                >
                                  <Route
                                    index={true}
                                    lazy={() =>
                                      import('../shared/Files/Files/index.jsx')
                                    }
                                  />
                                  <Route path=":fileId">
                                    <Route
                                      path="*"
                                      lazy={() =>
                                        import(
                                          '../shared/Files/Preview/index.jsx'
                                        )
                                      }
                                    />
                                    <Route
                                      path="Vorschau"
                                      lazy={() =>
                                        import(
                                          '../shared/Files/Preview/index.jsx'
                                        )
                                      }
                                    />
                                  </Route>
                                </Route>
                                <Route
                                  path="Zaehlungen"
                                  handle={tpopfeldkontrzaehlsHandle}
                                >
                                  <Route
                                    path="*"
                                    lazy={() =>
                                      import(
                                        '../Projekte/Daten/Tpopkontrzaehls/index.jsx'
                                      )
                                    }
                                  />
                                  <Route
                                    path=":tpopkontrzaehlId"
                                    lazy={() =>
                                      import(
                                        '../Projekte/Daten/Tpopkontrzaehl/index.jsx'
                                      )
                                    }
                                  />
                                </Route>
                              </Route>
                            </Route>
                            <Route
                              path="Freiwilligen-Kontrollen"
                              handle={tpopfreiwkontrsHandle}
                            >
                              <Route
                                path="*"
                                lazy={() =>
                                  import(
                                    '../Projekte/Daten/Tpopfreiwkontrs/index.jsx'
                                  )
                                }
                              />
                              <Route
                                path=":tpopkontrId"
                                handle={tpopfreiwkontrHandle}
                              >
                                <Route
                                  path="*"
                                  lazy={() =>
                                    import(
                                      '../Projekte/Daten/Tpopfreiwkontr/index.jsx'
                                    )
                                  }
                                />
                                <Route
                                  path="Dateien"
                                  lazy={() =>
                                    import(
                                      '../Projekte/Daten/Tpopfeldkontr/Dateien.jsx'
                                    )
                                  }
                                >
                                  <Route
                                    index={true}
                                    lazy={() =>
                                      import('../shared/Files/Files/index.jsx')
                                    }
                                  />
                                  <Route path=":fileId">
                                    <Route
                                      path="*"
                                      lazy={() =>
                                        import(
                                          '../shared/Files/Preview/index.jsx'
                                        )
                                      }
                                    />
                                    <Route
                                      path="Vorschau"
                                      lazy={() =>
                                        import(
                                          '../shared/Files/Preview/index.jsx'
                                        )
                                      }
                                    />
                                  </Route>
                                </Route>
                              </Route>
                            </Route>
                            <Route
                              path="Kontroll-Berichte"
                              handle={tpopbersHandle}
                            >
                              <Route
                                path="*"
                                lazy={() =>
                                  import('../Projekte/Daten/Tpopbers/index.jsx')
                                }
                              />
                              <Route
                                path=":tpopberId"
                                lazy={() =>
                                  import('../Projekte/Daten/Tpopber/index.jsx')
                                }
                              />
                            </Route>
                            <Route
                              path="Beobachtungen"
                              handle={beobZugeordnetHandle}
                            >
                              <Route
                                path="*"
                                lazy={() =>
                                  import(
                                    '../Projekte/Daten/BeobZugeordnets/index.jsx'
                                  )
                                }
                              />
                              <Route
                                path=":beobId"
                                lazy={() =>
                                  import(
                                    '../Projekte/Daten/Beobzuordnung/index.jsx'
                                  )
                                }
                              />
                            </Route>
                          </Route>
                        </Route>
                        <Route
                          path="Kontroll-Berichte"
                          handle={popbersHandle}
                        >
                          <Route
                            path="*"
                            lazy={() =>
                              import('../Projekte/Daten/Popbers/index.jsx')
                            }
                          />
                          <Route
                            path=":popberId"
                            lazy={() =>
                              import('../Projekte/Daten/Popber/index.jsx')
                            }
                          />
                        </Route>
                        <Route
                          path="Massnahmen-Berichte"
                          handle={popmassnbersHandle}
                        >
                          <Route
                            path="*"
                            lazy={() =>
                              import('../Projekte/Daten/Popmassnbers/index.jsx')
                            }
                          />
                          <Route
                            path=":popmassnberId"
                            lazy={() =>
                              import('../Projekte/Daten/Popmassnber/index.jsx')
                            }
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
            >
              <Route
                path="*"
                lazy={() => import('../Projekte/Daten/Users/index.jsx')}
              />
              <Route path=":userId">
                <Route
                  path="*"
                  lazy={() => import('../Projekte/Daten/User/index.jsx')}
                />
                <Route path="EKF">
                  <Route
                    path="*"
                    lazy={() => import('./EkfYearNavigator.jsx')}
                  />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
        <Route
          path="/Dokumentation"
          lazy={() => import('../Docs/index.jsx')}
        >
          <Route
            index
            element={null}
          />
          <Route
            path="was-kann-man-mit-apflora-machen"
            lazy={() => import('../Docs/docs/WasKannApflora.jsx')}
          />
          <Route
            path="technische-voraussetzungen"
            lazy={() => import('../Docs/docs/TechnischeVoraussetzungen.jsx')}
          />
          <Route
            path="tipps-fuer-den-einstieg"
            lazy={() => import('../Docs/docs/TippsFuerDenEinstieg.jsx')}
          />
          <Route
            path="videos-fuer-den-einstieg"
            lazy={() => import('../Docs/docs/VideosFuerDenEinstieg.jsx')}
          />
          <Route
            path="anleitung-eingabe"
            lazy={() => import('../Docs/docs/AnleitungZurEingabe.jsx')}
          />
          <Route
            path="ist-apflora-langsam"
            lazy={() => import('../Docs/docs/IstApfloraLangsam.jsx')}
          />
          <Route
            path="art-auswertung-pop-menge"
            lazy={() => import('../Docs/docs/ArtAuswertungPopMenge.jsx')}
          />
          <Route
            path="beobachtungen-einer-teil-population-zuordnen"
            lazy={() => import('../Docs/docs/BeobZuordnen/index.jsx')}
          />
          <Route
            path="falsch-bestimmte-beobachtungen"
            lazy={() => import('../Docs/docs/FalschBestimmteBeob.jsx')}
          />
          <Route
            path="erfolgs-kontrollen-planen"
            lazy={() => import('../Docs/docs/EkPlanen/index.jsx')}
          />
          <Route
            path="benutzer-konti"
            lazy={() => import('../Docs/docs/BenutzerKonti.jsx')}
          />
          <Route
            path="erfolgs-kontrollen-freiwillige"
            lazy={() => import('../Docs/docs/Ekf.jsx')}
          />
          <Route
            path="filter"
            lazy={() => import('../Docs/docs/Filter/index.jsx')}
          />
          <Route
            path="markdown"
            lazy={() => import('../Docs/docs/Markdown/index.jsx')}
          />
          <Route
            path="historisierung"
            lazy={() => import('../Docs/docs/Historisierung.jsx')}
          />
          <Route
            path="karte-teil-populationen-aller-arten-anzeigen"
            lazy={() => import('../Docs/docs/KarteTpopAllerArten.jsx')}
          />
          <Route
            path="karte-filter"
            lazy={() => import('../Docs/docs/KarteFilter.jsx')}
          />
          <Route
            path="karte-symbole-und-label-fuer-populationen-und-teil-populationen-waehlen"
            lazy={() =>
              import('../Docs/docs/KartePopTpopIconsLabelWaehlen/index.jsx')
            }
          />
          <Route
            path="karte-massstab"
            lazy={() => import('../Docs/docs/KarteMassstab/index.jsx')}
          />
          <Route
            path="karte-drucken"
            lazy={() => import('../Docs/docs/KarteDrucken.jsx')}
          />
          <Route
            path="gedaechtnis"
            lazy={() => import('../Docs/docs/Gedaechtnis.jsx')}
          />
          <Route
            path="dateien"
            lazy={() => import('../Docs/docs/Dateien/index.jsx')}
          />
          <Route
            path="koordinaten"
            lazy={() => import('../Docs/docs/Koordinaten/index.jsx')}
          />
          <Route
            path="melden"
            lazy={() => import('../Docs/docs/Melden.jsx')}
          />
          <Route
            path="pwa"
            lazy={() => import('../Docs/docs/Pwa/index.jsx')}
          />
          <Route
            path="technologien"
            lazy={() => import('../Docs/docs/Technologien/index.jsx')}
          />
          <Route
            path="beobachtungen-verwalten"
            lazy={() => import('../Docs/docs/BeobVerwalten/index.jsx')}
          />
          <Route
            path="produkte-fuer-die-fns"
            lazy={() => import('../Docs/docs/ProdukteFuerFNS.jsx')}
          />
          <Route
            path="daten-sichern"
            lazy={() => import('../Docs/docs/DatenSichern.jsx')}
          />
          <Route
            path="daten-wiederherstellen"
            lazy={() => import('../Docs/docs/DatenWiederherstellen.jsx')}
          />
          <Route
            path="testen"
            lazy={() => import('../Docs/docs/Testen.jsx')}
          />
          <Route
            path="geschichte"
            lazy={() => import('../Docs/docs/Geschichte.jsx')}
          />
          <Route
            path="open-source"
            lazy={() => import('../Docs/docs/OpenSource.jsx')}
          />
          <Route
            path="art-taxonomien-ergaenzen"
            lazy={() => import('../Docs/docs/ArtTaxonomieErgaenzen.jsx')}
          />
          <Route
            path="info-flora-export"
            lazy={() => import('../Docs/docs/InfofloraExport.jsx')}
          />
          <Route
            path="*"
            lazy={() => import('../404.jsx')}
          />
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
