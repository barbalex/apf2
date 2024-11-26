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
          path="/Daten"
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
              index
              lazy={() => import('../Projekte/Daten/Root/index.jsx')}
            />
            <Route path="Werte-Listen">
              <Route
                path="*"
                lazy={() => import('../Projekte/Daten/Wertes/index.jsx')}
              />
              <Route
                path="Adressen"
                lazy={() => import('../Projekte/Daten/Adresses/index.jsx')}
              />
              <Route
                path="Adressen/:adrId"
                lazy={() => import('../Projekte/Daten/Adresse/index.jsx')}
              />
              <Route
                path="ApberrelevantGrundWerte"
                lazy={() =>
                  import(
                    '../Projekte/Daten/TpopApberrelevantGrundWertes/index.jsx'
                  )
                }
              />
              <Route
                path="ApberrelevantGrundWerte/:wertId"
                lazy={() => import('../Projekte/Daten/Werte/index.jsx')}
              />
              <Route
                path="EkAbrechnungstypWerte"
                lazy={() =>
                  import('../Projekte/Daten/EkAbrechnungstypWertes/index.jsx')
                }
              />
              <Route
                path="EkAbrechnungstypWerte/:wertId"
                lazy={() => import('../Projekte/Daten/Werte/index.jsx')}
              />
              <Route
                path="TpopkontrzaehlEinheitWerte"
                lazy={() =>
                  import(
                    '../Projekte/Daten/TpopkontrzaehlEinheitWertes/index.jsx'
                  )
                }
              />
              <Route
                path="TpopkontrzaehlEinheitWerte/:wertId"
                lazy={() => import('../Projekte/Daten/Werte/index.jsx')}
              />
            </Route>
            <Route
              path="Mitteilungen"
              lazy={() => import('../Projekte/Daten/Messages/index.jsx')}
            />
            <Route
              path="Aktuelle-Fehler"
              lazy={() => import('../Projekte/Daten/CurrentIssues/index.jsx')}
            />
            <Route
              path="Aktuelle-Fehler/:issueId"
              lazy={() => import('../Projekte/Daten/CurrentIssue/index.jsx')}
            />
            <Route
              path="Projekte"
              lazy={() => import('../Projekte/Daten/Projects/index.jsx')}
            />
            <Route path="Projekte/:projId">
              <Route
                path="*"
                lazy={() => import('../Projekte/Daten/Projekt/index.jsx')}
              />
              <Route
                path="AP-Berichte"
                lazy={() =>
                  import('../Projekte/Daten/Apberuebersichts/index.jsx')
                }
              />
              <Route path="AP-Berichte/:apberUebersichtId">
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
              <Route
                path="Arten"
                lazy={() => import('../Projekte/Daten/Aps/index.jsx')}
              />
              <Route path="Arten/:apId">
                <Route
                  path="*"
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
                    lazy={() =>
                      import('../Projekte/Daten/Ap/Auswertung/index.jsx')
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
                    <Route
                      path=":fileId/Vorschau"
                      lazy={() => import('../shared/Files/Preview/index.jsx')}
                    />
                  </Route>
                  <Route
                    path="Historien"
                    lazy={() => import('../Projekte/Daten/Ap/Historien.jsx')}
                  />
                </Route>
                <Route path="AP-Ziele">
                  <Route
                    path="*"
                    lazy={() => import('../Projekte/Daten/Zieljahrs/index.jsx')}
                  />
                  <Route path=":jahr">
                    <Route
                      path="*"
                      lazy={() => import('../Projekte/Daten/Ziels/index.jsx')}
                    />
                    <Route path=":zielId">
                      <Route
                        path="*"
                        lazy={() => import('../Projekte/Daten/Ziel/index.jsx')}
                      />
                      <Route path="Berichte">
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
                <Route path="AP-Erfolgskriterien">
                  <Route
                    path="*"
                    lazy={() => import('../Projekte/Daten/Erfkrits/index.jsx')}
                  />
                  <Route
                    path=":erfkritId"
                    lazy={() => import('../Projekte/Daten/Erfkrit/index.jsx')}
                  />
                </Route>
                <Route path="AP-Berichte">
                  <Route
                    path="*"
                    lazy={() => import('../Projekte/Daten/Apbers/index.jsx')}
                  />
                  <Route path=":apberId">
                    <Route
                      path="*"
                      lazy={() => import('../Projekte/Daten/Apber/index.jsx')}
                    />
                    <Route
                      path="print"
                      lazy={() => import('../Print/ApberForApFromAp/index.jsx')}
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
                    <Route
                      path=":fileId/Vorschau"
                      lazy={() => import('../shared/Files/Preview/index.jsx')}
                    />
                  </Route>
                </Route>
                <Route path="Taxa">
                  <Route
                    path="*"
                    lazy={() => import('../Projekte/Daten/Aparts/index.jsx')}
                  />
                  <Route
                    path=":taxonId"
                    lazy={() => import('../Projekte/Daten/Apart/index.jsx')}
                  />
                </Route>
                <Route path="assoziierte-Arten">
                  <Route
                    path="*"
                    lazy={() => import('../Projekte/Daten/Assozarts/index.jsx')}
                  />
                  <Route
                    path=":assozartId"
                    lazy={() => import('../Projekte/Daten/Assozart/index.jsx')}
                  />
                </Route>
                <Route path="EK-Frequenzen">
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
                <Route path="EK-Zähleinheiten">
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
                <Route path="nicht-beurteilte-Beobachtungen">
                  <Route
                    path="*"
                    lazy={() =>
                      import('../Projekte/Daten/Beobzuordnungs/index.jsx')
                    }
                  />
                  <Route
                    path=":beobId"
                    lazy={() =>
                      import('../Projekte/Daten/Beobzuordnung/index.jsx')
                    }
                  />
                </Route>
                <Route path="nicht-zuzuordnende-Beobachtungen">
                  <Route
                    path="*"
                    lazy={() =>
                      import('../Projekte/Daten/Beobzuordnungs/index.jsx')
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
              </Route>
              <Route path="Arten/:apId/Populationen">
                <Route
                  path="*"
                  lazy={() => import('../Projekte/Daten/Pops/index.jsx')}
                />
                <Route
                  path=":popId/*"
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
                  >
                    <Route
                      index={true}
                      lazy={() => import('../shared/Files/Files/index.jsx')}
                    />
                    <Route
                      path=":fileId/Vorschau"
                      lazy={() => import('../shared/Files/Preview/index.jsx')}
                    />
                  </Route>
                  <Route
                    path="Historien"
                    lazy={() => import('../Projekte/Daten/Pop/Historien.jsx')}
                  />
                </Route>
              </Route>
              <Route path="Arten/:apId/Populationen/:popId/Massnahmen-Berichte">
                <Route
                  path="*"
                  lazy={() =>
                    import('../Projekte/Daten/Popmassnbers/index.jsx')
                  }
                />
                <Route
                  path=":popmassnberId/*"
                  lazy={() => import('../Projekte/Daten/Popmassnber/index.jsx')}
                />
              </Route>
              <Route
                path="Arten/:apId/Populationen/:popId/Kontroll-Berichte"
                lazy={() => import('../Projekte/Daten/Popbers/index.jsx')}
              />
              <Route
                path="Arten/:apId/Populationen/:popId/Kontroll-Berichte/:popberId/*"
                lazy={() => import('../Projekte/Daten/Popber/index.jsx')}
              />
              <Route
                path="Arten/:apId/Populationen/:popId/Teil-Populationen"
                lazy={() => import('../Projekte/Daten/Tpops/index.jsx')}
              />
              <Route
                path="Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/*"
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
                >
                  <Route
                    index={true}
                    lazy={() => import('../shared/Files/Files/index.jsx')}
                  />
                  <Route
                    path=":fileId/Vorschau"
                    lazy={() => import('../shared/Files/Preview/index.jsx')}
                  />
                </Route>
                <Route
                  path="Historien"
                  lazy={() => import('../Projekte/Daten/Tpop/Historien.jsx')}
                />
              </Route>
              <Route
                path="Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Massnahmen"
                lazy={() => import('../Projekte/Daten/Tpopmassns/index.jsx')}
              />
              <Route
                path="Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Massnahmen-Berichte"
                lazy={() => import('../Projekte/Daten/Tpopmassnbers/index.jsx')}
              />
              <Route
                path="Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Kontroll-Berichte"
                lazy={() => import('../Projekte/Daten/Tpopbers/index.jsx')}
              />
              <Route
                path="Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Beobachtungen"
                lazy={() =>
                  import('../Projekte/Daten/Beobzuordnungs/index.jsx')
                }
              />
              <Route
                path="Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Beobachtungen/:beobId/*"
                lazy={() => import('../Projekte/Daten/Beobzuordnung/index.jsx')}
              />
              <Route
                path="Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Kontroll-Berichte/:tpopberId/*"
                lazy={() => import('../Projekte/Daten/Tpopber/index.jsx')}
              />
              <Route
                path="Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Freiwilligen-Kontrollen"
                lazy={() =>
                  import('../Projekte/Daten/Tpopfreiwkontrs/index.jsx')
                }
              />
              <Route
                path="Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Freiwilligen-Kontrollen/:tpopkontrId/*"
                lazy={() =>
                  import('../Projekte/Daten/Tpopfreiwkontr/index.jsx')
                }
              />
              <Route
                path="Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Feld-Kontrollen"
                lazy={() =>
                  import('../Projekte/Daten/Tpopfeldkontrs/index.jsx')
                }
              />
              <Route
                path="Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Feld-Kontrollen/:tpopkontrId/*"
                lazy={() =>
                  import('../Projekte/Daten/TpopfeldkontrRouter/index.jsx')
                }
              >
                <Route
                  index={true}
                  lazy={() =>
                    import('../Projekte/Daten/Tpopfeldkontr/index.jsx')
                  }
                />
                <Route
                  path="Entwicklung"
                  lazy={() =>
                    import('../Projekte/Daten/Tpopfeldkontr/index.jsx')
                  }
                />
                <Route
                  path="Teil-Population"
                  lazy={() =>
                    import('../Projekte/Daten/Tpopfeldkontr/index.jsx')
                  }
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
                >
                  <Route
                    index={true}
                    lazy={() => import('../shared/Files/Files/index.jsx')}
                  />
                  <Route
                    path=":fileId/Vorschau"
                    lazy={() => import('../shared/Files/Preview/index.jsx')}
                  />
                </Route>
              </Route>
              <Route
                path="Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Feld-Kontrollen/:tpopkontrId/Zaehlungen"
                lazy={() =>
                  import('../Projekte/Daten/Tpopkontrzaehls/index.jsx')
                }
              />
              <Route
                path="Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Feld-Kontrollen/:tpopkontrId/Zaehlungen/:tpopkontrzaehlId/*"
                lazy={() =>
                  import('../Projekte/Daten/Tpopkontrzaehl/index.jsx')
                }
              />
              <Route
                path="Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Massnahmen-Berichte/:tpopmassnberId/*"
                lazy={() => import('../Projekte/Daten/Tpopmassnber/index.jsx')}
              />
              <Route
                path="Arten/:apId/Populationen/:popId/Teil-Populationen/:tpopId/Massnahmen/:tpopmassnId/*"
                lazy={() =>
                  import('../Projekte/Daten/TpopmassnRouter/index.jsx')
                }
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
                >
                  <Route
                    index={true}
                    lazy={() => import('../shared/Files/Files/index.jsx')}
                  />
                  <Route
                    path=":fileId/Vorschau"
                    lazy={() => import('../shared/Files/Preview/index.jsx')}
                  />
                </Route>
              </Route>
            </Route>
            <Route
              path="Benutzer"
              lazy={() => import('../Projekte/Daten/Users/index.jsx')}
            />
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
    {
      future: {
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_startTransition: true,
        v7_partialHydration: true,
        v7_skipActionStatusRevalidation: true,
        // This did not work on first try
        // Looks like LOTS of work and many possible errors...
        // https://reactrouter.com/en/6.27.0/upgrading/future#v7_relativesplatpath
        // v7_relativeSplatPath: true,
      },
    },
  )

  return <RouterProvider router={router} />
}
