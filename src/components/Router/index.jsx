import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'

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
          path="/Daten/*"
          lazy={() => import('./ProtectedRoute.jsx')}
        >
          {/* <Route path="*" element={<Unterhalt />}></Route> */}
          <Route
            path="Projekte/:projId/EK-Planung"
            lazy={() => import('../EkPlan/index.jsx')}
          />
          <Route
            path="Benutzer/:userId/EKF/:ekfYear/*"
            lazy={() => import('../Ekf/index.jsx')}
          />
          <Route
            path="Benutzer/:userId/EKF/:ekfYear/:ekfId"
            lazy={() => import('../Ekf/index.jsx')}
          />
          <Route
            path="*"
            lazy={() => import('../Projekte/index.jsx')}
          >
            <Route
              path="Werte-Listen/Adressen/:adrId"
              lazy={() => import('../Projekte/Daten/Adresse/index.jsx')}
            />
            <Route
              path="Werte-Listen/ApberrelevantGrundWerte/:wertId"
              lazy={() => import('../Projekte/Daten/Werte/index.jsx')}
            />
            <Route
              path="Werte-Listen/EkAbrechnungstypWerte/:wertId"
              lazy={() => import('../Projekte/Daten/Werte/index.jsx')}
            />
            <Route
              path="Werte-Listen/TpopkontrzaehlEinheitWerte/:wertId"
              lazy={() => import('../Projekte/Daten/Werte/index.jsx')}
            />
            <Route
              path="Mitteilungen"
              lazy={() => import('../Projekte/Daten/Messages/index.jsx')}
            />
            <Route
              path="Aktuelle-Fehler/:issueId"
              lazy={() => import('../Projekte/Daten/CurrentIssue/index.jsx')}
            />
            <Route
              path="Projekte/:projId/*"
              lazy={() => import('../Projekte/Daten/Projekt/index.jsx')}
            />
            <Route
              path="Projekte/:projId/AP-Berichte/:apberUebersichtId"
              lazy={() => import('../Projekte/Daten/Apberuebersicht/index.jsx')}
            />
            <Route
              path="Projekte/:projId/AP-Berichte/:apberUebersichtId/print"
              lazy={() => import('../Print/ApberForYear/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId"
              lazy={() => import('../Projekte/Daten/ApRouter/index.jsx')}
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
                lazy={() => import('../Projekte/Daten/Ap/Auswertung/index.jsx')}
              />
              <Route
                path="Dateien"
                lazy={() => import('../Projekte/Daten/Ap/Dateien/index.jsx')}
              >
                <Route
                  index={true}
                  lazy={() => import('../shared/Files/Files/index.jsx')}
                />
                <Route
                  path=":fileId/Vorschau"
                  lazy={() =>
                    import('../Projekte/Daten/Ap/Dateien/Preview.jsx')
                  }
                />
              </Route>
              <Route
                path="Historien"
                lazy={() => import('../Projekte/Daten/Ap/Historien.jsx')}
              />
              <Route
                path="nicht-zuzuordnende-Beobachtungen"
                lazy={() => import('../Projekte/Daten/Ap/index.jsx')}
              />
              <Route
                path="nicht-beurteilte-Beobachtungen"
                lazy={() => import('../Projekte/Daten/Ap/index.jsx')}
              />
              <Route
                path="EK-Zähleinheiten"
                lazy={() => import('../Projekte/Daten/Ap/index.jsx')}
              />
              <Route
                path="EK-Frequenzen"
                lazy={() => import('../Projekte/Daten/Ap/index.jsx')}
              />
              <Route
                path="assoziierte-Arten"
                lazy={() => import('../Projekte/Daten/Ap/index.jsx')}
              />
              <Route
                path="Taxa"
                lazy={() => import('../Projekte/Daten/Ap/index.jsx')}
              />
              <Route
                path="AP-Berichte"
                lazy={() => import('../Projekte/Daten/Ap/index.jsx')}
              />
              <Route
                path="AP-Erfolgskriterien"
                lazy={() => import('../Projekte/Daten/Ap/index.jsx')}
              />
              <Route
                path="AP-Ziele"
                lazy={() => import('../Projekte/Daten/Ap/index.jsx')}
              />
              <Route
                path="AP-Ziele/:jahr"
                lazy={() => import('../Projekte/Daten/Ap/index.jsx')}
              />
              <Route
                path="Populationen"
                lazy={() => import('../Projekte/Daten/Ap/index.jsx')}
              />
            </Route>
            <Route
              path="Projekte/:projId/Arten/:apId/Qualitaetskontrollen"
              lazy={() => import('../Projekte/Daten/QkRouter/index.jsx')}
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
                lazy={() => import('../Projekte/Daten/Qk/Choose/index.jsx')}
              />
            </Route>
            <Route
              path="Projekte/:projId/Arten/:apId/nicht-zuzuordnende-Beobachtungen/:beobId"
              lazy={() => import('../Projekte/Daten/Beobzuordnung/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/nicht-beurteilte-Beobachtungen/:beobId"
              lazy={() => import('../Projekte/Daten/Beobzuordnung/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/EK-Zähleinheiten/:zaehleinheitId"
              lazy={() => import('../Projekte/Daten/Ekzaehleinheit/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/EK-Frequenzen/:ekfrequenzId"
              lazy={() => import('../Projekte/Daten/Ekfrequenz/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/assoziierte-Arten/:assozartId"
              lazy={() => import('../Projekte/Daten/Assozart/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Taxa/:taxonId"
              lazy={() => import('../Projekte/Daten/Apart/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Idealbiotop"
              lazy={() =>
                import('../Projekte/Daten/IdealbiotopRouter/index.jsx')
              }
            >
              <Route
                index={true}
                lazy={() => import('../Projekte/Daten/Idealbiotop/index.jsx')}
              />
              <Route
                path="Idealbiotop"
                lazy={() => import('../Projekte/Daten/Idealbiotop/index.jsx')}
              />
              <Route
                path="Dateien"
                lazy={() => import('../Projekte/Daten/Idealbiotop/Dateien.jsx')}
              />
            </Route>
            <Route
              path="Projekte/:projId/Arten/:apId/AP-Berichte/:apberId"
              lazy={() => import('../Projekte/Daten/Apber/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/AP-Berichte/:apberId/print"
              lazy={() => import('../Print/ApberForApFromAp/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/AP-Erfolgskriterien/:erfkritId"
              lazy={() => import('../Projekte/Daten/Erfkrit/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/AP-Ziele/:jahr/:zielId/*"
              lazy={() => import('../Projekte/Daten/Ziel/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/AP-Ziele/:jahr/:zielId/Berichte/:zielberId"
              lazy={() => import('../Projekte/Daten/Zielber/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/*"
              lazy={() => import('../Projekte/Daten/PopRouter/index.jsx')}
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
                  import('../Projekte/Daten/Pop/Auswertung/index.jsx')
                }
              />
              <Route
                path="Dateien"
                lazy={() => import('../Projekte/Daten/Pop/Dateien.jsx')}
              />
              <Route
                path="Historien"
                lazy={() => import('../Projekte/Daten/Pop/Historien.jsx')}
              />
              <Route
                path="Massnahmen-Berichte"
                lazy={() => import('../Projekte/Daten/Pop/index.jsx')}
              />
              <Route
                path="Kontroll-Berichte"
                lazy={() => import('../Projekte/Daten/Pop/index.jsx')}
              />
              <Route
                path="Teil-Populationen"
                lazy={() => import('../Projekte/Daten/Pop/index.jsx')}
              />
            </Route>
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Massnahmen-Berichte/:popmassnberId/*"
              lazy={() => import('../Projekte/Daten/Popmassnber/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Kontroll-Berichte/:popberId/*"
              lazy={() => import('../Projekte/Daten/Popber/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/*"
              lazy={() => import('../Projekte/Daten/TpopRouter/index.jsx')}
            >
              <Route
                index={true}
                lazy={() => import('../Projekte/Daten/Tpop/index.jsx')}
              />
              <Route
                path="Teil-Population"
                lazy={() => import('../Projekte/Daten/Tpop/index.jsx')}
              />
              <Route
                path="EK"
                lazy={() => import('../Projekte/Daten/Tpop/Ek/index.jsx')}
              />
              <Route
                path="Dateien"
                lazy={() => import('../Projekte/Daten/Tpop/Dateien.jsx')}
              />
              <Route
                path="Historien"
                lazy={() => import('../Projekte/Daten/Tpop/Historien.jsx')}
              />
              <Route
                path="Massnahmen"
                lazy={() => import('../Projekte/Daten/Tpop/index.jsx')}
              />
              <Route
                path="Massnahmen-Berichte"
                lazy={() => import('../Projekte/Daten/Tpop/index.jsx')}
              />
              <Route
                path="Feld-Kontrollen"
                lazy={() => import('../Projekte/Daten/Tpop/index.jsx')}
              />
              <Route
                path="Freiwilligen-Kontrollen"
                lazy={() => import('../Projekte/Daten/Tpop/index.jsx')}
              />
              <Route
                path="Kontroll-Berichte"
                lazy={() => import('../Projekte/Daten/Tpop/index.jsx')}
              />
              <Route
                path="Beobachtungen"
                lazy={() => import('../Projekte/Daten/Tpop/index.jsx')}
              />
            </Route>
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Beobachtungen/:beobId/*"
              lazy={() => import('../Projekte/Daten/Beobzuordnung/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Kontroll-Berichte/:tpopberId/*"
              lazy={() => import('../Projekte/Daten/Tpopber/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Freiwilligen-Kontrollen/:tpopkontrId/*"
              lazy={() => import('../Projekte/Daten/Tpopfreiwkontr/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Feld-Kontrollen/:tpopkontrId/*"
              lazy={() =>
                import('../Projekte/Daten/TpopfeldkontrRouter/index.jsx')
              }
            >
              <Route
                index={true}
                lazy={() => import('../Projekte/Daten/Tpopfeldkontr/index.jsx')}
              />
              <Route
                path="Teil-Population"
                lazy={() => import('../Projekte/Daten/Tpopfeldkontr/index.jsx')}
              />
              <Route
                path="Biotop"
                lazy={() =>
                  import('../Projekte/Daten/Tpopfeldkontr/Biotop.jsx')
                }
              />
              <Route
                path="Dateien"
                lazy={() =>
                  import('../Projekte/Daten/Tpopfeldkontr/Dateien.jsx')
                }
              />
              <Route
                path="Zaehlungen"
                lazy={() => import('../Projekte/Daten/Tpopfeldkontr/index.jsx')}
              />
            </Route>
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Feld-Kontrollen/:tpopkontrId/Zaehlungen/:tpopkontrzaehlId/*"
              lazy={() => import('../Projekte/Daten/Tpopkontrzaehl/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Massnahmen-Berichte/:tpopmassnberId/*"
              lazy={() => import('../Projekte/Daten/Tpopmassnber/index.jsx')}
            />
            <Route
              path="Projekte/:projId/Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Massnahmen/:tpopmassnId/*"
              lazy={() => import('../Projekte/Daten/TpopmassnRouter/index.jsx')}
            >
              <Route
                index={true}
                lazy={() => import('../Projekte/Daten/Tpopmassn/index.jsx')}
              />
              <Route
                path="Massnahme"
                lazy={() => import('../Projekte/Daten/Tpopmassn/index.jsx')}
              />
              <Route
                path="Dateien"
                lazy={() => import('../Projekte/Daten/Tpopmassn/Dateien.jsx')}
              />
            </Route>
            <Route
              path="Benutzer/:userId/*"
              lazy={() => import('../Projekte/Daten/User/index.jsx')}
            />
            <Route
              path="Benutzer/:userId/EKF/*"
              lazy={() => import('./EkfYearNavigator.jsx')}
            />
          </Route>
        </Route>
        <Route
          path="/Dokumentation/*"
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
