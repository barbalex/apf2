import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'

import Home from '../Home'
import EkPlan from '../EkPlan'
import FourOhFour from '../404'
import DocRoutes from './DocRoutes'
import Docs from '../Docs'
import ProtectedRoute from './ProtectedRoute'
import Ekf from '../Ekf'
import Projekte from '../Projekte'
import Projekt from '../Projekte/Daten/Projekt'
import Apberuebersicht from '../Projekte/Daten/Apberuebersicht'
import ApberForYear from '../Print/ApberForYear'
import User from '../Projekte/Daten/User'
import Adresse from '../Projekte/Daten/Adresse'
import Werte from '../Projekte/Daten/Werte'
import Messages from '../Projekte/Daten/Messages'
import CurrentIssue from '../Projekte/Daten/CurrentIssue'
import Ap from '../Projekte/Daten/Ap'
import Qk from '../Projekte/Daten/Qk'
import Beobzuordnung from '../Projekte/Daten/Beobzuordnung'
import Ekzaehleinheit from '../Projekte/Daten/Ekzaehleinheit'
import Ekfrequenz from '../Projekte/Daten/Ekfrequenz'
import Assozart from '../Projekte/Daten/Assozart'
import Apart from '../Projekte/Daten/Apart'
import Idealbiotop from '../Projekte/Daten/Idealbiotop'
import Apber from '../Projekte/Daten/Apber'
import ApberForApFromAp from '../Print/ApberForApFromAp'
import Erfkrit from '../Projekte/Daten/Erfkrit'
import Ziel from '../Projekte/Daten/Ziel'
import Zielber from '../Projekte/Daten/Zielber'
import Pop from '../Projekte/Daten/Pop'
import Popmassnber from '../Projekte/Daten/Popmassnber'
import Popber from '../Projekte/Daten/Popber'
import Tpop from '../Projekte/Daten/Tpop'
import Tpopber from '../Projekte/Daten/Tpopber'
import Tpopfreiwkontr from '../Projekte/Daten/Tpopfreiwkontr'
import Tpopfeldkontr from '../Projekte/Daten/Tpopfeldkontr'
import Tpopmassnber from '../Projekte/Daten/Tpopmassnber'
import Tpopmassn from '../Projekte/Daten/Tpopmassn'
import Tpopkontrzaehl from '../Projekte/Daten/Tpopkontrzaehl'
import EkfYearNavigator from './EkfYearNavigator'
import AppBar from '../AppBar'
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
          {DocRoutes()}
        </Route>
        <Route path="*" element={<FourOhFour />} />
      </Route>,
    ),
  )

  return <RouterProvider router={router} />
}

export default RouterComponent
