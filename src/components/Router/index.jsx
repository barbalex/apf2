import { lazy } from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'

const FourOhFour = lazy(() => import('../404'))
const Docs = lazy(() => import('../Docs'))
const ProtectedRoute = lazy(() => import('./ProtectedRoute'))
const Ekf = lazy(() => import('../Ekf'))
const Projekte = lazy(() => import('../Projekte'))
const Projekt = lazy(() => import('../Projekte/Daten/Projekt'))
const Apberuebersicht = lazy(() => import('../Projekte/Daten/Apberuebersicht'))
const ApberForYear = lazy(() => import('../Print/ApberForYear'))
const Adresse = lazy(() => import('../Projekte/Daten/Adresse'))
const Werte = lazy(() => import('../Projekte/Daten/Werte'))
const Messages = lazy(() => import('../Projekte/Daten/Messages'))
const CurrentIssue = lazy(() => import('../Projekte/Daten/CurrentIssue'))
const Ap = lazy(() => import('../Projekte/Daten/Ap'))
const Qk = lazy(() => import('../Projekte/Daten/Qk'))
const Beobzuordnung = lazy(() => import('../Projekte/Daten/Beobzuordnung'))
const Ekzaehleinheit = lazy(() => import('../Projekte/Daten/Ekzaehleinheit'))
const Ekfrequenz = lazy(() => import('../Projekte/Daten/Ekfrequenz'))
const Assozart = lazy(() => import('../Projekte/Daten/Assozart'))
const Apart = lazy(() => import('../Projekte/Daten/Apart'))
const Idealbiotop = lazy(() => import('../Projekte/Daten/Idealbiotop'))
const Apber = lazy(() => import('../Projekte/Daten/Apber'))
const ApberForApFromAp = lazy(() => import('../Print/ApberForApFromAp'))
const Erfkrit = lazy(() => import('../Projekte/Daten/Erfkrit'))
const Ziel = lazy(() => import('../Projekte/Daten/Ziel'))
const Zielber = lazy(() => import('../Projekte/Daten/Zielber'))
const Pop = lazy(() => import('../Projekte/Daten/Pop'))
const Popmassnber = lazy(() => import('../Projekte/Daten/Popmassnber'))
const Popber = lazy(() => import('../Projekte/Daten/Popber'))
const Tpop = lazy(() => import('../Projekte/Daten/Tpop'))
const AppBar = lazy(() => import('../AppBar'))

// WARNING: errorElement did not work
// import ErrorBoundary from '../shared/ErrorBoundary'

// import Unterhalt from './components/Unterhalt'

// uncomment unterhalt route for Unterhalt
const RouterComponent = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppBar />}>
        <Route index lazy={() => import('../Home')} />
        <Route path="/Daten/*" lazy={() => import('./ProtectedRoute')}>
          {/* <Route path="*" element={<Unterhalt />}></Route> */}
          <Route
            path="Projekte/:projId/EK-Planung"
            lazy={() => import('../EkPlan')}
          />
          <Route
            path="Benutzer/:userId/EKF/:ekfYear/*"
            lazy={() => import('../Ekf')}
          />
          <Route
            path="Benutzer/:userId/EKF/:ekfYear/:ekfId"
            lazy={() => import('../Ekf')}
          />
          <Route path="*" lazy={() => import('../Projekte')}>
            <Route
              path="Werte-Listen/Adressen/:adrId"
              lazy={() => import('../Projekte/Daten/Adresse')}
            />
            <Route
              path="Werte-Listen/ApberrelevantGrundWerte/:wertId"
              element={<Werte table="tpopApberrelevantGrundWerte" />}
            />
            <Route
              path="Werte-Listen/EkAbrechnungstypWerte/:wertId"
              element={<Werte table="ekAbrechnungstypWerte" />}
            />
            <Route
              path="Werte-Listen/TpopkontrzaehlEinheitWerte/:wertId"
              element={<Werte table="tpopkontrzaehlEinheitWerte" />}
            />
            <Route path="Mitteilungen" element={<Messages />} />
            <Route
              path="Aktuelle-Fehler/:issueId"
              lazy={() => import('../Projekte/Daten/CurrentIssue')}
            />
            <Route
              path="Projekte/:projId/*"
              lazy={() => import('../Projekte/Daten/Projekt')}
            />
            <Route
              path="Projekte/:projId/AP-Berichte/:apberUebersichtId"
              lazy={() => import('../Projekte/Daten/Apberuebersicht')}
            />
            <Route
              path="Projekte/:projId/AP-Berichte/:apberUebersichtId/print"
              lazy={() => import('../Print/ApberForYear')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/*"
              lazy={() => import('../Projekte/Daten/Ap')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Qualitaetskontrollen"
              lazy={() => import('../Projekte/Daten/Qk')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/nicht-zuzuordnende-Beobachtungen/:beobId"
              element={<Beobzuordnung type="nichtZuzuordnen" />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/nicht-beurteilte-Beobachtungen/:beobId"
              element={<Beobzuordnung type="nichtBeurteilt" />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/EK-Zähleinheiten/:zaehleinheitId"
              element={<Ekzaehleinheit />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/EK-Frequenzen/:ekfrequenzId"
              element={<Ekfrequenz />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/assoziierte-Arten/:assozartId"
              element={<Assozart />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Taxa/:taxonId"
              element={<Apart />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Idealbiotop"
              element={<Idealbiotop />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/AP-Berichte/:apberId"
              element={<Apber />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/AP-Berichte/:apberId/print"
              element={<ApberForApFromAp />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/AP-Erfolgskriterien/:erfkritId"
              element={<Erfkrit />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/AP-Ziele/:jahr/:zielId/*"
              element={<Ziel />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/AP-Ziele/:jahr/:zielId/Berichte/:zielberId"
              element={<Zielber />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/*"
              element={<Pop />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Massnahmen-Berichte/:popmassnberId/*"
              element={<Popmassnber />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Kontroll-Berichte/:popberId/*"
              element={<Popber />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/*"
              element={<Tpop />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Beobachtungen/:beobId/*"
              element={<Beobzuordnung type="zugeordnet" />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Kontroll-Berichte/:tpopberId/*"
              lazy={() => import('../Projekte/Daten/Tpopber')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Freiwilligen-Kontrollen/:tpopkontrId/*"
              lazy={() => import('../Projekte/Daten/Tpopfreiwkontr')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Feld-Kontrollen/:tpopkontrId/*"
              lazy={() => import('../Projekte/Daten/Tpopfeldkontr')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Feld-Kontrollen/:tpopkontrId/Zaehlungen/:tpopkontrzaehlId/*"
              lazy={() => import('../Projekte/Daten/Tpopkontrzaehl')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Massnahmen-Berichte/:tpopmassnberId/*"
              lazy={() => import('../Projekte/Daten/Tpopmassnber')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Massnahmen/:tpopmassnId/*"
              lazy={() => import('../Projekte/Daten/Tpopmassn')}
            />
            <Route
              path="Benutzer/:userId/*"
              lazy={() => import('../Projekte/Daten/User')}
            />
            <Route
              path="Benutzer/:userId/EKF/*"
              lazy={() => import('./EkfYearNavigator')}
            />
          </Route>
        </Route>
        <Route path="/Dokumentation/*" element={<Docs />}>
          <Route index element={null} />
          <Route
            path="was-kann-man-mit-apflora-machen"
            lazy={() => import('../Docs/docs/WasKannApflora')}
          />
          <Route
            path="technische-voraussetzungen"
            lazy={() => import('../Docs/docs/TechnischeVoraussetzungen')}
          />
          <Route
            path="tipps-fuer-den-einstieg"
            lazy={() => import('../Docs/docs/TippsFuerDenEinstieg')}
          />
          <Route
            path="videos-fuer-den-einstieg"
            lazy={() => import('../Docs/docs/VideosFuerDenEinstieg')}
          />
          <Route
            path="anleitung-eingabe"
            lazy={() => import('../Docs/docs/AnleitungZurEingabe')}
          />
          <Route
            path="ist-apflora-langsam"
            lazy={() => import('../Docs/docs/IstApfloraLangsam')}
          />
          <Route
            path="art-auswertung-pop-menge"
            lazy={() => import('../Docs/docs/ArtAuswertungPopMenge')}
          />
          <Route
            path="beobachtungen-einer-teil-population-zuordnen"
            lazy={() => import('../Docs/docs/BeobZuordnen')}
          />
          <Route
            path="falsch-bestimmte-beobachtungen"
            lazy={() => import('../Docs/docs/FalschBestimmteBeob')}
          />
          <Route
            path="erfolgs-kontrollen-planen"
            lazy={() => import('../Docs/docs/EkPlanen')}
          />
          <Route
            path="benutzer-konti"
            lazy={() => import('../Docs/docs/BenutzerKonti')}
          />
          <Route
            path="erfolgs-kontrollen-freiwillige"
            lazy={() => import('../Docs/docs/Ekf')}
          />
          <Route path="filter" lazy={() => import('../Docs/docs/Filter')} />
          <Route path="markdown" lazy={() => import('../Docs/docs/Markdown')} />
          <Route
            path="historisierung"
            lazy={() => import('../Docs/docs/Historisierung')}
          />
          <Route
            path="karte-teil-populationen-aller-arten-anzeigen"
            lazy={() => import('../Docs/docs/KarteTpopAllerArten')}
          />
          <Route
            path="karte-filter"
            lazy={() => import('../Docs/docs/KarteFilter')}
          />
          <Route
            path="karte-symbole-und-label-fuer-populationen-und-teil-populationen-waehlen"
            lazy={() => import('../Docs/docs/KartePopTpopIconsLabelWaehlen')}
          />
          <Route
            path="karte-massstab"
            lazy={() => import('../Docs/docs/KarteMassstab')}
          />
          <Route
            path="karte-drucken"
            lazy={() => import('../Docs/docs/KarteDrucken')}
          />
          <Route
            path="gedaechtnis"
            lazy={() => import('../Docs/docs/Gedaechtnis')}
          />
          <Route path="dateien" lazy={() => import('../Docs/docs/Dateien')} />
          <Route
            path="koordinaten"
            lazy={() => import('../Docs/docs/Koordinaten')}
          />
          <Route path="melden" lazy={() => import('../Docs/docs/Melden')} />
          <Route path="pwa" lazy={() => import('../Docs/docs/Pwa')} />
          <Route
            path="technologien"
            lazy={() => import('../Docs/docs/Technologien')}
          />
          <Route
            path="beobachtungen-verwalten"
            lazy={() => import('../Docs/docs/BeobVerwalten')}
          />
          <Route
            path="produkte-fuer-die-fns"
            lazy={() => import('../Docs/docs/ProdukteFuerFNS')}
          />
          <Route
            path="daten-sichern"
            lazy={() => import('../Docs/docs/DatenSichern')}
          />
          <Route
            path="daten-wiederherstellen"
            lazy={() => import('../Docs/docs/DatenWiederherstellen')}
          />
          <Route path="testen" lazy={() => import('../Docs/docs/Testen')} />
          <Route
            path="geschichte"
            lazy={() => import('../Docs/docs/Geschichte')}
          />
          <Route
            path="open-source"
            lazy={() => import('../Docs/docs/OpenSource')}
          />
          <Route
            path="art-taxonomien-ergaenzen"
            lazy={() => import('../Docs/docs/ArtTaxonomieErgaenzen')}
          />
          <Route
            path="info-flora-export"
            lazy={() => import('../Docs/docs/InfofloraExport')}
          />
          <Route path="*" element={<FourOhFour />} />
        </Route>
        <Route path="*" element={<FourOhFour />} />
      </Route>,
    ),
  )

  return <RouterProvider router={router} />
}

export default RouterComponent
