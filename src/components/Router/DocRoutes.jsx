import { Route } from 'react-router-dom'

import WasKannApflora from '../Docs/docs/WasKannApflora'
import TechnischeVoraussetzungen from '../Docs/docs/TechnischeVoraussetzungen'
import TippsFuerDenEinstieg from '../Docs/docs/TippsFuerDenEinstieg'
import VideosFuerDenEinstieg from '../Docs/docs/VideosFuerDenEinstieg'
import AnleitungZurEingabe from '../Docs/docs/AnleitungZurEingabe'
import IstApfloraLangsam from '../Docs/docs/IstApfloraLangsam'
import ArtAuswertungPopMenge from '../Docs/docs/ArtAuswertungPopMenge'
import BeobZuordnen from '../Docs/docs/BeobZuordnen'
import FalschBestimmteBeob from '../Docs/docs/FalschBestimmteBeob'
import EkPlanen from '../Docs/docs/EkPlanen'
import BenutzerKonti from '../Docs/docs/BenutzerKonti'
import Ekf from '../Docs/docs/Ekf'
import Filter from '../Docs/docs/filter'
import Markdown from '../Docs/docs/Markdown'
import Historisierung from '../Docs/docs/Historisierung'
import KarteTpopAllerArten from '../Docs/docs/KarteTpopAllerArten'
import KarteFilter from '../Docs/docs/KarteFilter'
import KartePopTpopIconsLabelWaehlen from '../Docs/docs/KartePopTpopIconsLabelWaehlen'
import KarteMassstab from '../Docs/docs/KarteMassstab'
import KarteDrucken from '../Docs/docs/KarteDrucken'
import Gedaechtnis from '../Docs/docs/Gedaechtnis'
import Dateien from '../Docs/docs/Dateien'
import Koordinaten from '../Docs/docs/Koordinaten'
import Melden from '../Docs/docs/Melden'
import Pwa from '../Docs/docs/Pwa'
import Technologien from '../Docs/docs/Technologien'
import BeobVerwalten from '../Docs/docs/BeobVerwalten'
import ProdukteFuerFNS from '../Docs/docs/ProdukteFuerFNS'
import DatenSichern from '../Docs/docs/DatenSichern'
import DatenWiederherstellen from '../Docs/docs/DatenWiederherstellen'
import Testen from '../Docs/docs/Testen'
import Geschichte from '../Docs/docs/Geschichte'
import OpenSource from '../Docs/docs/OpenSource'
import ArtTaxonomieErgaenzen from '../Docs/docs/ArtTaxonomieErgaenzen'
import InfoFloraExport from '../Docs/docs/InfofloraExport'

const DocRoutes = () => (
  <>
    <Route
      path="was-kann-man-mit-apflora-machen"
      element={<WasKannApflora />}
    />
    <Route
      path="technische-voraussetzungen"
      element={<TechnischeVoraussetzungen />}
    />
    <Route path="tipps-fuer-den-einstieg" element={<TippsFuerDenEinstieg />} />
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
    <Route path="erfolgs-kontrollen-freiwillige" element={<Ekf />} />
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
    <Route path="daten-wiederherstellen" element={<DatenWiederherstellen />} />
    <Route path="testen" element={<Testen />} />
    <Route path="geschichte" element={<Geschichte />} />
    <Route path="open-source" element={<OpenSource />} />
    <Route
      path="art-taxonomien-ergaenzen"
      element={<ArtTaxonomieErgaenzen />}
    />
    <Route path="info-flora-export" element={<InfoFloraExport />} />
  </>
)

export default DocRoutes
