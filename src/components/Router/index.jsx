import { lazy } from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'

const Home = lazy(() => import('../Home'))
const EkPlan = lazy(() => import('../EkPlan'))
const FourOhFour = lazy(() => import('../404'))
const Docs = lazy(() => import('../Docs'))
const ProtectedRoute = lazy(() => import('./ProtectedRoute'))
const Ekf = lazy(() => import('../Ekf'))
const Projekte = lazy(() => import('../Projekte'))
const Projekt = lazy(() => import('../Projekte/Daten/Projekt'))
const Apberuebersicht = lazy(() => import('../Projekte/Daten/Apberuebersicht'))
const ApberForYear = lazy(() => import('../Print/ApberForYear'))
const User = lazy(() => import('../Projekte/Daten/User'))
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
const Tpopber = lazy(() => import('../Projekte/Daten/Tpopber'))
const Tpopfreiwkontr = lazy(() => import('../Projekte/Daten/Tpopfreiwkontr'))
const Tpopfeldkontr = lazy(() => import('../Projekte/Daten/Tpopfeldkontr'))
const Tpopmassnber = lazy(() => import('../Projekte/Daten/Tpopmassnber'))
const Tpopmassn = lazy(() => import('../Projekte/Daten/Tpopmassn'))
const Tpopkontrzaehl = lazy(() => import('../Projekte/Daten/Tpopkontrzaehl'))
const EkfYearNavigator = lazy(() => import('./EkfYearNavigator'))
const AppBar = lazy(() => import('../AppBar'))
// docs:
const WasKannApflora = lazy(() => import('../Docs/docs/WasKannApflora'))
const TechnischeVoraussetzungen = lazy(() =>
  import('../Docs/docs/TechnischeVoraussetzungen'),
)
const TippsFuerDenEinstieg = lazy(() =>
  import('../Docs/docs/TippsFuerDenEinstieg'),
)
const VideosFuerDenEinstieg = lazy(() =>
  import('../Docs/docs/VideosFuerDenEinstieg'),
)
const AnleitungZurEingabe = lazy(() =>
  import('../Docs/docs/AnleitungZurEingabe'),
)
const IstApfloraLangsam = lazy(() => import('../Docs/docs/IstApfloraLangsam'))
const ArtAuswertungPopMenge = lazy(() =>
  import('../Docs/docs/ArtAuswertungPopMenge'),
)
const BeobZuordnen = lazy(() => import('../Docs/docs/BeobZuordnen'))
const FalschBestimmteBeob = lazy(() =>
  import('../Docs/docs/FalschBestimmteBeob'),
)
const EkPlanen = lazy(() => import('../Docs/docs/EkPlanen'))
const BenutzerKonti = lazy(() => import('../Docs/docs/BenutzerKonti'))
const EkfDocs = lazy(() => import('../Docs/docs/Ekf'))
const Filter = lazy(() => import('../Docs/docs/Filter'))
const Markdown = lazy(() => import('../Docs/docs/Markdown'))
const Historisierung = lazy(() => import('../Docs/docs/Historisierung'))
const KarteTpopAllerArten = lazy(() =>
  import('../Docs/docs/KarteTpopAllerArten'),
)
const KarteFilter = lazy(() => import('../Docs/docs/KarteFilter'))
const KartePopTpopIconsLabelWaehlen = lazy(() =>
  import('../Docs/docs/KartePopTpopIconsLabelWaehlen'),
)
const KarteMassstab = lazy(() => import('../Docs/docs/KarteMassstab'))
const KarteDrucken = lazy(() => import('../Docs/docs/KarteDrucken'))
const Gedaechtnis = lazy(() => import('../Docs/docs/Gedaechtnis'))
const Dateien = lazy(() => import('../Docs/docs/Dateien'))
const Koordinaten = lazy(() => import('../Docs/docs/Koordinaten'))
const Melden = lazy(() => import('../Docs/docs/Melden'))
const Pwa = lazy(() => import('../Docs/docs/Pwa'))
const Technologien = lazy(() => import('../Docs/docs/Technologien'))
const BeobVerwalten = lazy(() => import('../Docs/docs/BeobVerwalten'))
const ProdukteFuerFNS = lazy(() => import('../Docs/docs/ProdukteFuerFNS'))
const DatenSichern = lazy(() => import('../Docs/docs/DatenSichern'))
const DatenWiederherstellen = lazy(() =>
  import('../Docs/docs/DatenWiederherstellen'),
)
const Testen = lazy(() => import('../Docs/docs/Testen'))
const Geschichte = lazy(() => import('../Docs/docs/Geschichte'))
const OpenSource = lazy(() => import('../Docs/docs/OpenSource'))
const ArtTaxonomieErgaenzen = lazy(() =>
  import('../Docs/docs/ArtTaxonomieErgaenzen'),
)
const InfoFloraExport = lazy(() => import('../Docs/docs/InfofloraExport'))
// import Unterhalt from './components/Unterhalt'

// uncomment unterhalt route for Unterhalt
const RouterComponent = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppBar />}>
        <Route index element={<Home />} />
        <Route path="/Daten/*" element={<ProtectedRoute />}>
          {/* <Route path="*" element={<Unterhalt />}></Route> */}
          <Route path="Projekte/:projId/EK-Planung" element={<EkPlan />} />
          <Route path="Benutzer/:userId/EKF/:ekfYear/*" element={<Ekf />} />
          <Route
            path="Benutzer/:userId/EKF/:ekfYear/:ekfId"
            element={<Ekf />}
          />
          <Route path="*" element={<Projekte />}>
            <Route path="Werte-Listen/Adressen/:adrId" element={<Adresse />} />
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
            <Route path="Aktuelle-Fehler/:issueId" element={<CurrentIssue />} />
            <Route path="Projekte/:projId/*" element={<Projekt />} />
            <Route
              path="Projekte/:projId/AP-Berichte/:apberUebersichtId"
              element={<Apberuebersicht />}
            />
            <Route
              path="Projekte/:projId/AP-Berichte/:apberUebersichtId/print"
              element={<ApberForYear />}
            />
            <Route path="Projekte/:projId/Arten/:apId/*" element={<Ap />} />
            <Route
              path="Projekte/:projId/Arten/:apId/Qualitaetskontrollen"
              element={<Qk />}
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
              element={<Tpopber />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Freiwilligen-Kontrollen/:tpopkontrId/*"
              element={<Tpopfreiwkontr />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Feld-Kontrollen/:tpopkontrId/*"
              element={<Tpopfeldkontr />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Feld-Kontrollen/:tpopkontrId/Zaehlungen/:tpopkontrzaehlId/*"
              element={<Tpopkontrzaehl />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Massnahmen-Berichte/:tpopmassnberId/*"
              element={<Tpopmassnber />}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Massnahmen/:tpopmassnId/*"
              element={<Tpopmassn />}
            />
            <Route path="Benutzer/:userId/*" element={<User />} />
            <Route
              path="Benutzer/:userId/EKF/*"
              element={<EkfYearNavigator />}
            />
          </Route>
        </Route>
        <Route path="/Dokumentation/*" element={<Docs />}>
          <Route
            path="was-kann-man-mit-apflora-machen"
            element={<WasKannApflora />}
          />
          <Route
            path="technische-voraussetzungen"
            element={<TechnischeVoraussetzungen />}
          />
          <Route
            path="tipps-fuer-den-einstieg"
            element={<TippsFuerDenEinstieg />}
          />
          <Route
            path="videos-fuer-den-einstieg"
            element={<VideosFuerDenEinstieg />}
          />
          <Route path="anleitung-eingabe" element={<AnleitungZurEingabe />} />
          <Route path="ist-apflora-langsam" element={<IstApfloraLangsam />} />
          <Route
            path="art-auswertung-pop-menge"
            element={<ArtAuswertungPopMenge />}
          />
          <Route
            path="beobachtungen-einer-teil-population-zuordnen"
            element={<BeobZuordnen />}
          />
          <Route
            path="falsch-bestimmte-beobachtungen"
            element={<FalschBestimmteBeob />}
          />
          <Route path="erfolgs-kontrollen-planen" element={<EkPlanen />} />
          <Route path="benutzer-konti" element={<BenutzerKonti />} />
          <Route path="erfolgs-kontrollen-freiwillige" element={<EkfDocs />} />
          <Route path="filter" element={<Filter />} />
          <Route path="markdown" element={<Markdown />} />
          <Route path="historisierung" element={<Historisierung />} />
          <Route
            path="karte-teil-populationen-aller-arten-anzeigen"
            element={<KarteTpopAllerArten />}
          />
          <Route path="karte-filter" element={<KarteFilter />} />
          <Route
            path="karte-symbole-und-label-fuer-populationen-und-teil-populationen-waehlen"
            element={<KartePopTpopIconsLabelWaehlen />}
          />
          <Route path="karte-massstab" element={<KarteMassstab />} />
          <Route path="karte-drucken" element={<KarteDrucken />} />
          <Route path="gedaechtnis" element={<Gedaechtnis />} />
          <Route path="dateien" element={<Dateien />} />
          <Route path="koordinaten" element={<Koordinaten />} />
          <Route path="melden" element={<Melden />} />
          <Route path="pwa" element={<Pwa />} />
          <Route path="technologien" element={<Technologien />} />
          <Route path="beobachtungen-verwalten" element={<BeobVerwalten />} />
          <Route path="produkte-fuer-die-fns" element={<ProdukteFuerFNS />} />
          <Route path="daten-sichern" element={<DatenSichern />} />
          <Route
            path="daten-wiederherstellen"
            element={<DatenWiederherstellen />}
          />
          <Route path="testen" element={<Testen />} />
          <Route path="geschichte" element={<Geschichte />} />
          <Route path="open-source" element={<OpenSource />} />
          <Route
            path="art-taxonomien-ergaenzen"
            element={<ArtTaxonomieErgaenzen />}
          />
          <Route path="info-flora-export" element={<InfoFloraExport />} />
        </Route>
        <Route path="*" element={<FourOhFour />} />
      </Route>,
    ),
  )

  return <RouterProvider router={router} />
}

export default RouterComponent
