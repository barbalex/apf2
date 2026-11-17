import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { Spinner } from '../shared/Spinner.tsx'
import { RouterErrorBoundary } from '../shared/RouterErrorBoundary.tsx'

/**
 * Wraps a route lazy import. When the chunk cannot be loaded — a stale
 * client (open tab across a deploy) requesting a hashed asset that no
 * longer exists — the promise resolves to a Component that rethrows the
 * import error on render, so react-router routes it to the route's
 * errorElement. Rejections of the function-form lazy() are otherwise
 * swallowed by react-router 8.5.1 (blank screen, no errorElement; the
 * fix for react-router #15657 only covers the object form).
 */
const lazyRoute =
  (load: () => Promise<unknown>): (() => Promise<{ Component: () => never }>) =>
  async () => {
    try {
      return (await load()) as { Component: () => never }
    } catch (error) {
      return {
        Component: function FailedImport() {
          throw error
        },
      }
    }
  }

const datenHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useRootNavData',
}
const projekteHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useProjekteNavData',
}
const projektHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useProjektNavData',
}
const apberuebersichtsHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useApberuebersichtsNavData',
}
const apsHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useApsNavData',
}
const usersHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useUsersNavData',
}
const currentissuesHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useCurrentissuesNavData',
}
const messagesHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useMessagesNavData',
}
const wertesHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useWertesNavData',
}
const adressesHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useAdressesNavData',
}
const tpopApberrelevantGrundWertesHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useTpopApberrelevantGrundWertesNavData',
}
const ekAbrechnungstypWertesHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useEkAbrechnungstypWertesNavData',
}
const tpopkontrzaehlEinheitWertesHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useTpopkontrzaehlEinheitWertesNavData',
}
const apHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useApNavData',
}
const beobNichtBeurteiltHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useBeobNichtBeurteiltsNavData',
}
const beobNichtZuzuordnenHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useBeobNichtZuzuordnensNavData',
}
const beobZugeordnetHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useBeobZugeordnetsNavData',
}
const popsHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'usePopsNavData',
}
const zielJahrsHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useZieljahrsNavData',
}
const zielsOfJahrHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useZielsOfJahrNavData',
}
const zielHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useZielNavData',
}
const erfkritsHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useErfkritsNavData',
}
const apbersHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useApbersNavData',
}
const apartsHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useApartsNavData',
}
const assozartsHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useAssozartsNavData',
}
const ekfrequenzsHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useEkfrequenzsNavData',
}
const ekzaehleinheitsHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useEkzaehleinheitsNavData',
}
const popHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'usePopNavData',
}
const popmassnbersHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'usePopmassnbersNavData',
}
const popbersHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'usePopbersNavData',
}
const tpopsHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useTpopsNavData',
}
const tpopHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useTpopNavData',
}
const tpopmassnsHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useTpopmassnsNavData',
}
const tpopmassnbersHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useTpopmassnbersNavData',
}
const tpopbersHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useTpopbersNavData',
}
const tpopfreiwkontrsHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useTpopfreiwkontrsNavData',
}
const tpopfeldkontrsHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useTpopfeldkontrsNavData',
}
const tpopfeldkontrHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useTpopfeldkontrNavData',
}
const tpopfeldkontrzaehlsHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useTpopfeldkontrzaehlsNavData',
}
const tpopmassnHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useTpopmassnNavData',
}
const tpopfreiwkontrHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useTpopfreiwkontrNavData',
}
const idealbiotopHandle = {
  bookmarkFetcher: true,
  bookmarkFetcherName: 'useIdealbiotopNavData',
}
// RouterErrorBoundary is statically imported on purpose: the error
// boundary must not live in a lazy chunk. Stale clients (open tab across
// a deploy) get 404s on every hashed lazy chunk — including this one —
// and would otherwise end up with a blank screen instead of the error UI
// with its reload buttons

export const datenRoutes = (
  <Route
    path="/Daten"
    lazy={lazyRoute(() => import('./ProtectedRoute.tsx'))}
    handle={datenHandle}
    errorElement={<RouterErrorBoundary />}
  >
    <Route
      path="Projekte/:projId/EK-Planung"
      lazy={lazyRoute(() => import('../EkPlan/index.tsx'))}
      errorElement={<RouterErrorBoundary />}
    />
    <Route
      path="Benutzer/:userId/EKF/:ekfYear"
      lazy={lazyRoute(() => import('../Ekf/index.tsx'))}
      errorElement={<RouterErrorBoundary />}
    >
      <Route
        path="*"
        lazy={lazyRoute(() => import('../Ekf/index.tsx'))}
        errorElement={<RouterErrorBoundary />}
      />
      <Route
        path=":ekfId"
        lazy={lazyRoute(() => import('../Ekf/index.tsx'))}
        errorElement={<RouterErrorBoundary />}
      />
    </Route>
    <Route
      path="*"
      lazy={lazyRoute(() => import('../Projekte/index.tsx'))}
      errorElement={<RouterErrorBoundary />}
    >
      <Route
        index
        lazy={lazyRoute(() => import('../Projekte/Daten/Root/index.tsx'))}
        errorElement={<RouterErrorBoundary />}
      />
      <Route
        path="Werte-Listen"
        handle={wertesHandle}
        errorElement={<RouterErrorBoundary />}
      >
        <Route
          path="*"
          lazy={lazyRoute(() => import('../Projekte/Daten/Wertes/index.tsx'))}
          errorElement={<RouterErrorBoundary />}
        />
        <Route
          path="Adressen"
          handle={adressesHandle}
          errorElement={<RouterErrorBoundary />}
        >
          <Route
            path="*"
            lazy={lazyRoute(() => import('../Projekte/Daten/Adresses/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path=":adrId"
            lazy={lazyRoute(() => import('../Projekte/Daten/Adresse/index.tsx'))}
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
            lazy={lazyRoute(() => import('../Projekte/Daten/TpopApberrelevantGrundWertes/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path=":wertId"
            lazy={lazyRoute(() => import('../Projekte/Daten/Werte/index.tsx'))}
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
            lazy={lazyRoute(() => import('../Projekte/Daten/EkAbrechnungstypWertes/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path=":wertId"
            lazy={lazyRoute(() => import('../Projekte/Daten/Werte/index.tsx'))}
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
            lazy={lazyRoute(() => import('../Projekte/Daten/TpopkontrzaehlEinheitWertes/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path=":wertId"
            lazy={lazyRoute(() => import('../Projekte/Daten/Werte/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
        </Route>
      </Route>
      <Route
        path="Mitteilungen"
        lazy={lazyRoute(() => import('../Projekte/Daten/Messages/index.tsx'))}
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
          lazy={lazyRoute(() => import('../Projekte/Daten/CurrentIssues/index.tsx'))}
          errorElement={<RouterErrorBoundary />}
        />
        <Route
          path=":issueId"
          lazy={lazyRoute(() => import('../Projekte/Daten/CurrentIssue/index.tsx'))}
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
          lazy={lazyRoute(() => import('../Projekte/Daten/Projects/index.tsx'))}
          errorElement={<RouterErrorBoundary />}
        />
        <Route
          path=":projId"
          handle={projektHandle}
          errorElement={<RouterErrorBoundary />}
        >
          <Route
            path="*"
            lazy={lazyRoute(() => import('../Projekte/Daten/Projekt/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="Projekt"
            lazy={lazyRoute(() => import('../Projekte/Daten/Projekt/Projekt.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="AP-Berichte"
            handle={apberuebersichtsHandle}
            errorElement={<RouterErrorBoundary />}
          >
            <Route
              path="*"
              lazy={lazyRoute(() => import('../Projekte/Daten/Apberuebersichts/index.tsx'))}
              errorElement={<RouterErrorBoundary />}
            />
            <Route path=":apberuebersichtId">
              <Route
                path="*"
                lazy={lazyRoute(() => import('../Projekte/Daten/Apberuebersicht/index.tsx'))}
                errorElement={<RouterErrorBoundary />}
              />
              <Route
                path="print"
                lazy={lazyRoute(() => import('../Print/ApberForYear/index.tsx'))}
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
              lazy={lazyRoute(() => import('../Projekte/Daten/Aps/index.tsx'))}
              errorElement={<RouterErrorBoundary />}
            />
            <Route
              path=":apId"
              handle={apHandle}
              errorElement={<RouterErrorBoundary />}
            >
              <Route
                index={true}
                lazy={lazyRoute(() => import('../Projekte/Daten/Ap/index.tsx'))}
                errorElement={<RouterErrorBoundary />}
              />
              <Route
                path="Art"
                lazy={lazyRoute(() => import('../Projekte/Daten/Ap/Ap/index.tsx'))}
                errorElement={<RouterErrorBoundary />}
              />
              <Route
                path="Auswertung"
                lazy={lazyRoute(() => import('../Projekte/Daten/ApAuswertung/index.tsx'))}
                errorElement={<RouterErrorBoundary />}
              />
              <Route
                path="Dateien"
                lazy={lazyRoute(() => import('../Projekte/Daten/Ap/Dateien.tsx'))}
                errorElement={<RouterErrorBoundary />}
              >
                <Route
                  index={true}
                  lazy={lazyRoute(() => import('../shared/Files/Files/index.tsx'))}
                  errorElement={<RouterErrorBoundary />}
                />
                <Route path=":fileId">
                  <Route
                    path="*"
                    lazy={lazyRoute(() => import('../shared/Files/Preview/index.tsx'))}
                    errorElement={<RouterErrorBoundary />}
                  />
                  <Route
                    path="Vorschau"
                    lazy={lazyRoute(() => import('../shared/Files/Preview/index.tsx'))}
                    errorElement={<RouterErrorBoundary />}
                  />
                </Route>
              </Route>
              <Route
                path="Historien"
                lazy={lazyRoute(() => import('../Projekte/Daten/Ap/Historien/index.tsx'))}
                errorElement={<RouterErrorBoundary />}
              />
              <Route
                path="AP-Ziele"
                handle={zielJahrsHandle}
                errorElement={<RouterErrorBoundary />}
              >
                <Route
                  path="*"
                  lazy={lazyRoute(() => import('../Projekte/Daten/Zieljahrs/index.tsx'))}
                  errorElement={<RouterErrorBoundary />}
                />
                <Route
                  path=":jahr"
                  handle={zielsOfJahrHandle}
                  errorElement={<RouterErrorBoundary />}
                >
                  <Route
                    path="*"
                    lazy={lazyRoute(() => import('../Projekte/Daten/Ziels/index.tsx'))}
                    errorElement={<RouterErrorBoundary />}
                  />
                  <Route
                    path=":zielId"
                    handle={zielHandle}
                    errorElement={<RouterErrorBoundary />}
                  >
                    <Route
                      path="*"
                      lazy={lazyRoute(() => import('../Projekte/Daten/Ziel/index.tsx'))}
                      errorElement={<RouterErrorBoundary />}
                    />
                    <Route
                      path="Ziel"
                      lazy={lazyRoute(() => import('../Projekte/Daten/Ziel/Ziel.tsx'))}
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
                  lazy={lazyRoute(() => import('../Projekte/Daten/Erfkrits/index.tsx'))}
                  errorElement={<RouterErrorBoundary />}
                />
                <Route
                  path=":erfkritId"
                  lazy={lazyRoute(() => import('../Projekte/Daten/Erfkrit/index.tsx'))}
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
                  lazy={lazyRoute(() => import('../Projekte/Daten/Apbers/index.tsx'))}
                  errorElement={<RouterErrorBoundary />}
                />
                <Route path=":apberId">
                  <Route
                    path="*"
                    lazy={lazyRoute(() => import('../Projekte/Daten/Apber/index.tsx'))}
                    errorElement={<RouterErrorBoundary />}
                  />
                  <Route
                    path="print"
                    lazy={lazyRoute(() => import('../Print/ApberForApFromAp/index.tsx'))}
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
                  lazy={lazyRoute(() => import('../Projekte/Daten/Idealbiotop/index.tsx'))}
                  errorElement={<RouterErrorBoundary />}
                />
                <Route
                  path="Idealbiotop"
                  lazy={lazyRoute(() => import('../Projekte/Daten/Idealbiotop/Idealbiotop.tsx'))}
                  errorElement={<RouterErrorBoundary />}
                />
                <Route
                  path="Dateien"
                  lazy={lazyRoute(() => import('../Projekte/Daten/Idealbiotop/Dateien.tsx'))}
                  errorElement={<RouterErrorBoundary />}
                >
                  <Route
                    index={true}
                    lazy={lazyRoute(() => import('../shared/Files/Files/index.tsx'))}
                    errorElement={<RouterErrorBoundary />}
                  />
                  <Route path=":fileId">
                    <Route
                      path="*"
                      lazy={lazyRoute(() => import('../shared/Files/Preview/index.tsx'))}
                      errorElement={<RouterErrorBoundary />}
                    />
                    <Route
                      path="Vorschau"
                      lazy={lazyRoute(() => import('../shared/Files/Preview/index.tsx'))}
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
                  lazy={lazyRoute(() => import('../Projekte/Daten/Aparts/index.tsx'))}
                  errorElement={<RouterErrorBoundary />}
                />
                <Route
                  path=":taxonId"
                  lazy={lazyRoute(() => import('../Projekte/Daten/Apart/index.tsx'))}
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
                  lazy={lazyRoute(() => import('../Projekte/Daten/Assozarts/index.tsx'))}
                  errorElement={<RouterErrorBoundary />}
                />
                <Route
                  path=":assozartId"
                  lazy={lazyRoute(() => import('../Projekte/Daten/Assozart/index.tsx'))}
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
                  lazy={lazyRoute(() => import('../Projekte/Daten/Ekfrequenzs/index.tsx'))}
                  errorElement={<RouterErrorBoundary />}
                />
                <Route
                  path=":ekfrequenzId"
                  lazy={lazyRoute(() => import('../Projekte/Daten/Ekfrequenz/index.tsx'))}
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
                  lazy={lazyRoute(() => import('../Projekte/Daten/Ekzaehleinheits/index.tsx'))}
                  errorElement={<RouterErrorBoundary />}
                />
                <Route
                  path=":zaehleinheitId"
                  lazy={lazyRoute(() => import('../Projekte/Daten/Ekzaehleinheit/index.tsx'))}
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
                  lazy={lazyRoute(() => import('../Projekte/Daten/BeobNichtBeurteilts/index.tsx'))}
                  errorElement={<RouterErrorBoundary />}
                />
                <Route
                  path=":beobId"
                  lazy={lazyRoute(() => import('../Projekte/Daten/Beobzuordnung/index.tsx'))}
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
                  lazy={lazyRoute(() => import('../Projekte/Daten/BeobNichtZuzuordnens/index.tsx'))}
                  errorElement={<RouterErrorBoundary />}
                />
                <Route
                  path=":beobId"
                  lazy={lazyRoute(() => import('../Projekte/Daten/Beobzuordnung/index.tsx'))}
                  errorElement={<RouterErrorBoundary />}
                />
              </Route>
              <Route
                path="Qualitätskontrollen"
                lazy={lazyRoute(() => import('../Projekte/Daten/Qk/index.tsx'))}
                errorElement={<RouterErrorBoundary />}
              />
              <Route
                path="Qualitätskontrollen-wählen"
                lazy={lazyRoute(() => import('../Projekte/Daten/Qk/Choose/index.tsx'))}
                errorElement={<RouterErrorBoundary />}
              />
              <Route
                path="Populationen"
                handle={popsHandle}
                errorElement={<RouterErrorBoundary />}
              >
                <Route
                  path="*"
                  lazy={lazyRoute(() => import('../Projekte/Daten/Pops/index.tsx'))}
                  errorElement={<RouterErrorBoundary />}
                />
                <Route
                  path=":popId"
                  handle={popHandle}
                  errorElement={<RouterErrorBoundary />}
                >
                  <Route
                    index={true}
                    lazy={lazyRoute(() => import('../Projekte/Daten/Pop/index.tsx'))}
                    errorElement={<RouterErrorBoundary />}
                  />
                  <Route
                    path="Population"
                    lazy={lazyRoute(() => import('../Projekte/Daten/Pop/Pop.tsx'))}
                    errorElement={<RouterErrorBoundary />}
                  />
                  <Route
                    path="Auswertung"
                    lazy={lazyRoute(() => import('../Projekte/Daten/PopAuswertung/index.tsx'))}
                    errorElement={<RouterErrorBoundary />}
                  />
                  <Route
                    path="Dateien"
                    lazy={lazyRoute(() => import('../Projekte/Daten/Pop/Dateien.tsx'))}
                    errorElement={<RouterErrorBoundary />}
                  >
                    <Route
                      index={true}
                      lazy={lazyRoute(() => import('../shared/Files/Files/index.tsx'))}
                      errorElement={<RouterErrorBoundary />}
                    />
                    <Route path=":fileId">
                      <Route
                        index={true}
                        lazy={lazyRoute(() => import('../shared/Files/Preview/index.tsx'))}
                        errorElement={<RouterErrorBoundary />}
                      />
                      <Route
                        path="Vorschau"
                        lazy={lazyRoute(() => import('../shared/Files/Preview/index.tsx'))}
                        errorElement={<RouterErrorBoundary />}
                      />
                    </Route>
                  </Route>
                  <Route
                    path="Historien"
                    lazy={lazyRoute(() => import('../Projekte/Daten/Pop/Historien/index.tsx'))}
                    errorElement={<RouterErrorBoundary />}
                  />
                  <Route
                    path="Teil-Populationen"
                    handle={tpopsHandle}
                    errorElement={<RouterErrorBoundary />}
                  >
                    <Route
                      path="*"
                      lazy={lazyRoute(() => import('../Projekte/Daten/Tpops/index.tsx'))}
                      errorElement={<RouterErrorBoundary />}
                    />
                    <Route
                      path=":tpopId"
                      handle={tpopHandle}
                      errorElement={<RouterErrorBoundary />}
                    >
                      <Route
                        index={true}
                        lazy={lazyRoute(() => import('../Projekte/Daten/Tpop/index.tsx'))}
                        errorElement={<RouterErrorBoundary />}
                      />
                      <Route
                        path="Teil-Population"
                        lazy={lazyRoute(() => import('../Projekte/Daten/Tpop/Tpop.tsx'))}
                        errorElement={<RouterErrorBoundary />}
                      />
                      <Route
                        path="EK"
                        lazy={lazyRoute(() => import('../Projekte/Daten/TpopEk/index.tsx'))}
                        errorElement={<RouterErrorBoundary />}
                      />
                      <Route
                        path="Dateien"
                        lazy={lazyRoute(() => import('../Projekte/Daten/Tpop/Dateien.tsx'))}
                        errorElement={<RouterErrorBoundary />}
                      >
                        <Route
                          index={true}
                          lazy={lazyRoute(() => import('../shared/Files/Files/index.tsx'))}
                          errorElement={<RouterErrorBoundary />}
                        />
                        <Route path=":fileId">
                          <Route
                            path="*"
                            lazy={lazyRoute(() => import('../shared/Files/Preview/index.tsx'))}
                            errorElement={<RouterErrorBoundary />}
                          />
                          <Route
                            path="Vorschau"
                            lazy={lazyRoute(() => import('../shared/Files/Preview/index.tsx'))}
                            errorElement={<RouterErrorBoundary />}
                          />
                        </Route>
                      </Route>
                      <Route
                        path="Historien"
                        lazy={lazyRoute(() => import('../Projekte/Daten/Tpop/Historien/index.tsx'))}
                        errorElement={<RouterErrorBoundary />}
                      />
                      <Route
                        path="Massnahmen"
                        handle={tpopmassnsHandle}
                        errorElement={<RouterErrorBoundary />}
                      >
                        <Route
                          path="*"
                          lazy={lazyRoute(() => import('../Projekte/Daten/Tpopmassns/index.tsx'))}
                          errorElement={<RouterErrorBoundary />}
                        />
                        <Route
                          path=":tpopmassnId"
                          handle={tpopmassnHandle}
                          errorElement={<RouterErrorBoundary />}
                        >
                          <Route
                            path="*"
                            lazy={lazyRoute(() => import('../Projekte/Daten/Tpopmassn/index.tsx'))}
                            errorElement={<RouterErrorBoundary />}
                          />
                          <Route
                            path="Massnahme"
                            lazy={lazyRoute(() => import('../Projekte/Daten/Tpopmassn/Tpopmassn.tsx'))}
                            errorElement={<RouterErrorBoundary />}
                          />
                          <Route
                            path="Dateien"
                            lazy={lazyRoute(() => import('../Projekte/Daten/Tpopmassn/Dateien.tsx'))}
                            errorElement={<RouterErrorBoundary />}
                          >
                            <Route
                              index={true}
                              lazy={lazyRoute(() => import('../shared/Files/Files/index.tsx'))}
                              errorElement={<RouterErrorBoundary />}
                            />
                            <Route path=":fileId">
                              <Route
                                path="*"
                                lazy={lazyRoute(() => import('../shared/Files/Preview/index.tsx'))}
                                errorElement={<RouterErrorBoundary />}
                              />
                              <Route
                                path="Vorschau"
                                lazy={lazyRoute(() => import('../shared/Files/Preview/index.tsx'))}
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
                          lazy={lazyRoute(() => import('../Projekte/Daten/Tpopmassnbers/index.tsx'))}
                          errorElement={<RouterErrorBoundary />}
                        />
                        <Route
                          path=":tpopmassnberId"
                          lazy={lazyRoute(() => import('../Projekte/Daten/Tpopmassnber/index.tsx'))}
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
                          lazy={lazyRoute(() => import('../Projekte/Daten/Tpopfeldkontrs/index.tsx'))}
                          errorElement={<RouterErrorBoundary />}
                        />
                        <Route
                          path=":tpopkontrId"
                          handle={tpopfeldkontrHandle}
                          errorElement={<RouterErrorBoundary />}
                        >
                          <Route
                            index={true}
                            lazy={lazyRoute(() => import('../Projekte/Daten/Tpopfeldkontr/index.tsx'))}
                            errorElement={<RouterErrorBoundary />}
                          />
                          <Route
                            path="Feld-Kontrolle"
                            lazy={lazyRoute(() => import('../Projekte/Daten/Tpopfeldkontr/Tpopfeldkontr.tsx'))}
                            errorElement={<RouterErrorBoundary />}
                          />
                          <Route
                            path="Teil-Population"
                            lazy={lazyRoute(() => import('../Projekte/Daten/Tpopfeldkontr/index.tsx'))}
                            errorElement={<RouterErrorBoundary />}
                          />
                          <Route
                            path="Biotop"
                            lazy={lazyRoute(() => import('../Projekte/Daten/Tpopfeldkontr/Biotop.tsx'))}
                            errorElement={<RouterErrorBoundary />}
                          />
                          <Route
                            path="Dateien"
                            lazy={lazyRoute(() => import('../Projekte/Daten/Tpopfeldkontr/Dateien.tsx'))}
                            errorElement={<RouterErrorBoundary />}
                          >
                            <Route
                              index={true}
                              lazy={lazyRoute(() => import('../shared/Files/Files/index.tsx'))}
                              errorElement={<RouterErrorBoundary />}
                            />
                            <Route path=":fileId">
                              <Route
                                path="*"
                                lazy={lazyRoute(() => import('../shared/Files/Preview/index.tsx'))}
                                errorElement={<RouterErrorBoundary />}
                              />
                              <Route
                                path="Vorschau"
                                lazy={lazyRoute(() => import('../shared/Files/Preview/index.tsx'))}
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
                              lazy={lazyRoute(() => import('../Projekte/Daten/Tpopkontrzaehls/index.tsx'))}
                              errorElement={<RouterErrorBoundary />}
                            />
                            <Route
                              path=":tpopkontrzaehlId"
                              lazy={lazyRoute(() => import('../Projekte/Daten/Tpopkontrzaehl/index.tsx'))}
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
                          lazy={lazyRoute(() => import('../Projekte/Daten/Tpopfreiwkontrs/index.tsx'))}
                          errorElement={<RouterErrorBoundary />}
                        />
                        <Route
                          path=":tpopkontrId"
                          handle={tpopfreiwkontrHandle}
                          errorElement={<RouterErrorBoundary />}
                        >
                          <Route
                            path="*"
                            lazy={lazyRoute(() => import('../Projekte/Daten/Tpopfreiwkontr/index.tsx'))}
                            errorElement={<RouterErrorBoundary />}
                          />
                          <Route
                            path="Freiwilligen-Kontrolle"
                            lazy={lazyRoute(() => import('../Projekte/Daten/Tpopfreiwkontr/Tpopfreiwkontr.tsx'))}
                            errorElement={<RouterErrorBoundary />}
                          />
                          <Route
                            path="Dateien"
                            lazy={lazyRoute(() => import('../Projekte/Daten/Tpopfeldkontr/Dateien.tsx'))}
                            errorElement={<RouterErrorBoundary />}
                          >
                            <Route
                              index={true}
                              lazy={lazyRoute(() => import('../shared/Files/Files/index.tsx'))}
                              errorElement={<RouterErrorBoundary />}
                            />
                            <Route path=":fileId">
                              <Route
                                path="*"
                                lazy={lazyRoute(() => import('../shared/Files/Preview/index.tsx'))}
                                errorElement={<RouterErrorBoundary />}
                              />
                              <Route
                                path="Vorschau"
                                lazy={lazyRoute(() => import('../shared/Files/Preview/index.tsx'))}
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
                          lazy={lazyRoute(() => import('../Projekte/Daten/Tpopbers/index.tsx'))}
                          errorElement={<RouterErrorBoundary />}
                        />
                        <Route
                          path=":tpopberId"
                          lazy={lazyRoute(() => import('../Projekte/Daten/Tpopber/index.tsx'))}
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
                          lazy={lazyRoute(() => import('../Projekte/Daten/BeobZugeordnets/index.tsx'))}
                          errorElement={<RouterErrorBoundary />}
                        />
                        <Route
                          path=":beobId"
                          lazy={lazyRoute(() => import('../Projekte/Daten/Beobzuordnung/index.tsx'))}
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
                      lazy={lazyRoute(() => import('../Projekte/Daten/Popbers/index.tsx'))}
                      errorElement={<RouterErrorBoundary />}
                    />
                    <Route
                      path=":popberId"
                      lazy={lazyRoute(() => import('../Projekte/Daten/Popber/index.tsx'))}
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
                      lazy={lazyRoute(() => import('../Projekte/Daten/Popmassnbers/index.tsx'))}
                      errorElement={<RouterErrorBoundary />}
                    />
                    <Route
                      path=":popmassnberId"
                      lazy={lazyRoute(() => import('../Projekte/Daten/Popmassnber/index.tsx'))}
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
          lazy={lazyRoute(() => import('../Projekte/Daten/Users/index.tsx'))}
          errorElement={<RouterErrorBoundary />}
        />
        <Route path=":userId">
          <Route
            path="*"
            lazy={lazyRoute(() => import('../Projekte/Daten/User/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route path="EKF">
            <Route
              path="*"
              lazy={lazyRoute(() => import('./EkfYearNavigator.tsx'))}
              errorElement={<RouterErrorBoundary />}
            />
          </Route>
        </Route>
      </Route>
    </Route>
  </Route>
)

// The router MUST be created exactly once. Recreating it while the app
// runs remounts the whole tree and re-resolves every route lazy() —
// the blank flashes when the desktop/mobile view mode switches.
// View-mode switching happens inside the routed components instead
// (see src/components/Docs/Doc.tsx and src/components/Docs/index.tsx).
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      lazy={lazyRoute(() => import('../AppBar/index.tsx'))}
      hydrateFallbackElement={<Spinner />}
      errorElement={<RouterErrorBoundary />}
    >
      <Route
        index
        lazy={lazyRoute(() => import('../Home/index.tsx'))}
        errorElement={<RouterErrorBoundary />}
      />
      {datenRoutes}

      <Route
        path="Dokumentation"
        errorElement={<RouterErrorBoundary />}
      >
        <Route
          index={true}
          lazy={lazyRoute(() => import('../Docs/index.tsx'))}
          errorElement={<RouterErrorBoundary />}
        />
        <Route
          path="*"
          lazy={lazyRoute(() => import('../Docs/Doc.tsx'))}
          errorElement={<RouterErrorBoundary />}
        >
          <Route
            path="was-kann-man-mit-apflora-machen"
            lazy={lazyRoute(() => import('../Docs/docs/WasKannApflora.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="technische-voraussetzungen"
            lazy={lazyRoute(() => import('../Docs/docs/TechnischeVoraussetzungen.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="tipps-fuer-den-einstieg"
            lazy={lazyRoute(() => import('../Docs/docs/TippsFuerDenEinstieg.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="videos-fuer-den-einstieg"
            lazy={lazyRoute(() => import('../Docs/docs/VideosFuerDenEinstieg.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="anleitung-eingabe"
            lazy={lazyRoute(() => import('../Docs/docs/AnleitungZurEingabe.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="navigation"
            lazy={lazyRoute(() => import('../Docs/docs/Navigation/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="ist-apflora-langsam"
            lazy={lazyRoute(() => import('../Docs/docs/IstApfloraLangsam.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="art-auswertung-pop-menge"
            lazy={lazyRoute(() => import('../Docs/docs/ArtAuswertungPopMenge.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="beobachtungen-einer-teil-population-zuordnen"
            lazy={lazyRoute(() => import('../Docs/docs/BeobZuordnen/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="falsch-bestimmte-beobachtungen"
            lazy={lazyRoute(() => import('../Docs/docs/FalschBestimmteBeob.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="erfolgs-kontrollen-planen"
            lazy={lazyRoute(() => import('../Docs/docs/EkPlanen/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="benutzer-konti"
            lazy={lazyRoute(() => import('../Docs/docs/BenutzerKonti.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="erfolgs-kontrollen-freiwillige"
            lazy={lazyRoute(() => import('../Docs/docs/Ekf.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="filter"
            lazy={lazyRoute(() => import('../Docs/docs/Filter/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="markdown"
            lazy={lazyRoute(() => import('../Docs/docs/Markdown/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="historisierung"
            lazy={lazyRoute(() => import('../Docs/docs/Historisierung.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="karte-teil-populationen-aller-arten-anzeigen"
            lazy={lazyRoute(() => import('../Docs/docs/KarteTpopAllerArten.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="karte-filter"
            lazy={lazyRoute(() => import('../Docs/docs/KarteFilter.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="karte-symbole-und-label-fuer-populationen-und-teil-populationen-waehlen"
            lazy={lazyRoute(() => import('../Docs/docs/KartePopTpopIconsLabelWaehlen/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="karte-massstab"
            lazy={lazyRoute(() => import('../Docs/docs/KarteMassstab/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="karte-drucken"
            lazy={lazyRoute(() => import('../Docs/docs/KarteDrucken.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="gedaechtnis"
            lazy={lazyRoute(() => import('../Docs/docs/Gedaechtnis.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="dateien"
            lazy={lazyRoute(() => import('../Docs/docs/Dateien/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="koordinaten"
            lazy={lazyRoute(() => import('../Docs/docs/Koordinaten/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="melden"
            lazy={lazyRoute(() => import('../Docs/docs/Melden.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="pwa"
            lazy={lazyRoute(() => import('../Docs/docs/Pwa/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="technologien"
            lazy={lazyRoute(() => import('../Docs/docs/Technologien/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="beobachtungen-verwalten"
            lazy={lazyRoute(() => import('../Docs/docs/BeobVerwalten/index.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="produkte-fuer-die-fns"
            lazy={lazyRoute(() => import('../Docs/docs/ProdukteFuerFNS.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="daten-sichern"
            lazy={lazyRoute(() => import('../Docs/docs/DatenSichern.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="daten-wiederherstellen"
            lazy={lazyRoute(() => import('../Docs/docs/DatenWiederherstellen.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="testen"
            lazy={lazyRoute(() => import('../Docs/docs/Testen.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="geschichte"
            lazy={lazyRoute(() => import('../Docs/docs/Geschichte.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="open-source"
            lazy={lazyRoute(() => import('../Docs/docs/OpenSource.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="art-taxonomien-ergaenzen"
            lazy={lazyRoute(() => import('../Docs/docs/ArtTaxonomieErgaenzen.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="info-flora-export"
            lazy={lazyRoute(() => import('../Docs/docs/InfofloraExport.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="*"
            lazy={lazyRoute(() => import('../404.tsx'))}
            errorElement={<RouterErrorBoundary />}
          />
        </Route>
      </Route>
      <Route
        path="*"
        lazy={lazyRoute(() => import('../404.tsx'))}
      />
    </Route>,
  ),
)

export const Router = () => <RouterProvider router={router} />
