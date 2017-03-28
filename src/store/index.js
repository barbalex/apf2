// @flow
import {
  extendObservable,
  action,
  autorun,
  autorunAsync,
  computed,
  observable,
} from 'mobx'
import $ from 'jquery'
import sortBy from 'lodash/sortBy'
import filter from 'lodash/filter'

import fetchTable from '../modules/fetchTable'
import fetchBeobzuordnungModule from '../modules/fetchBeobzuordnung'
import fetchTableByParentId from '../modules/fetchTableByParentId'
import fetchTpopForAp from '../modules/fetchTpopForAp'
import fetchPopForAp from '../modules/fetchPopForAp'
import fetchDatasetById from '../modules/fetchDatasetById'
import fetchBeobBereitgestellt from '../modules/fetchBeobBereitgestellt'
import fetchBeobEvab from '../modules/fetchBeobEvab'
import fetchBeobInfospezies from '../modules/fetchBeobInfospezies'
import updateActiveDatasetFromUrl from '../modules/updateActiveDatasetFromUrl'
import getActiveUrlElements from '../modules/getActiveUrlElements'
import fetchDataForActiveUrlElements from '../modules/fetchDataForActiveUrlElements'
import buildProjektNodes from '../modules/nodes/projekt'
import updateProperty from '../modules/updateProperty'
import updatePropertyInDb from '../modules/updatePropertyInDb'
import manipulateUrl from '../modules/manipulateUrl'
import getUrl from '../modules/getUrl'
import getUrlQuery from '../modules/getUrlQuery'
import fetchFields from '../modules/fetchFields'
import fetchFieldsFromIdb from '../modules/fetchFieldsFromIdb'
import insertDataset from '../modules/insertDataset'
import insertBeobzuordnung from '../modules/insertBeobzuordnung'
import deleteDatasetDemand from '../modules/deleteDatasetDemand'
import deleteDatasetExecute from '../modules/deleteDatasetExecute'
import toggleNode from '../modules/toggleNode'
import listError from '../modules/listError'
import setUrlQuery from '../modules/setUrlQuery'
import setQk from '../modules/setQk'
import setQkFilter from '../modules/setQkFilter'
import fetchQk from '../modules/fetchQk'
import addMessagesToQk from '../modules/addMessagesToQk'
import getPopsForMap from '../modules/getPopsForMap'
import getTpopsForMap from '../modules/getTpopsForMap'
import getBeobForMap from '../modules/getBeobForMap'
import getPopBounds from '../modules/getPopBounds'
import getTpopBounds from '../modules/getTpopBounds'
import getTpopBeobBounds from '../modules/getTpopBeobBounds'
import getBeobNichtZuzuordnenBounds from '../modules/getBeobNichtZuzuordnenBounds'
import getBeobNichtBeurteiltBounds from '../modules/getBeobNichtBeurteiltBounds'
import epsg4326to21781 from '../modules/epsg4326to21781'
import getPopMarkers from '../modules/getPopMarkers'
import getTpopMarkers from '../modules/getTpopMarkers'
import getTpopMarkersClustered from '../modules/getTpopMarkersClustered'
import getBeobMarkersClustered from '../modules/getBeobMarkersClustered'
import getBeobMarkers from '../modules/getBeobMarkers'
import getBeobNichtBeurteiltMarkersClustered from '../modules/getBeobNichtBeurteiltMarkersClustered'
import getBeobNichtBeurteiltMarkers from '../modules/getBeobNichtBeurteiltMarkers'
import getBeobNichtZuzuordnenMarkersClustered from '../modules/getBeobNichtZuzuordnenMarkersClustered'
import getTpopBeobMarkersClustered from '../modules/getTpopBeobMarkersClustered'
import getTpopBeobMarkers from '../modules/getTpopBeobMarkers'
import getTpopBeobAssignPolylines from '../modules/getTpopBeobAssignPolylines'
import fetchLogin from '../modules/fetchLogin'
import logout from '../modules/logout'
import setLoginFromIdb from '../modules/setLoginFromIdb'
import localizeTpop from '../modules/localizeTpop'
import fetchStammdatenTables from '../modules/fetchStammdatenTables'
import projektNodes from '../modules/nodes/projekt'
import apFolderNodes from '../modules/nodes/apFolder'
import apberuebersichtFolderNodes from '../modules/nodes/apberuebersichtFolder'
import apberuebersichtNodes from '../modules/nodes/apberuebersicht'
import exporteFolderNodes from '../modules/nodes/exporteFolder'
import apNodes from '../modules/nodes/ap'
import allNodes from '../modules/nodes/allNodes'
import qkFolderNode from '../modules/nodes/qkFolder'
import assozartFolderNode from '../modules/nodes/assozartFolder'
import assozartNode from '../modules/nodes/assozart'
import idealbiotopFolderNode from '../modules/nodes/idealbiotopFolder'
import beobNichtZuzuordnenFolderNode from '../modules/nodes/beobNichtZuzuordnenFolder'
import beobNichtZuzuordnenNode from '../modules/nodes/beobNichtZuzuordnen'
import beobzuordnungFolderNode from '../modules/nodes/beobzuordnungFolder'
import beobzuordnungNode from '../modules/nodes/beobzuordnung'
import berFolderNode from '../modules/nodes/berFolder'
import berNode from '../modules/nodes/ber'
import apberFolderNode from '../modules/nodes/apberFolder'
import apberNode from '../modules/nodes/apber'
import erfkritFolderNode from '../modules/nodes/erfkritFolder'
import erfkritNode from '../modules/nodes/erfkrit'
import zieljahreFolderNode from '../modules/nodes/zieljahrFolder'
import zieljahrNode from '../modules/nodes/zieljahr'
import zielNode from '../modules/nodes/ziel'
import zielberFolderNode from '../modules/nodes/zielberFolder'
import zielberNode from '../modules/nodes/zielber'
import popFolderNode from '../modules/nodes/popFolder'
import popNode from '../modules/nodes/pop'
import popmassnberFolderNode from '../modules/nodes/popmassnberFolder'
import popmassnberNode from '../modules/nodes/popmassnber'
import popberFolderNode from '../modules/nodes/popberFolder'
import popberNode from '../modules/nodes/popber'
import tpopFolderNode from '../modules/nodes/tpopFolder'
import tpopNode from '../modules/nodes/tpop'
import tpopbeobFolderNode from '../modules/nodes/tpopbeobFolder'
import tpopbeobNode from '../modules/nodes/tpopbeob'
import tpopberFolderNode from '../modules/nodes/tpopberFolder'
import tpopberNode from '../modules/nodes/tpopber'
import tpopfreiwkontrFolderNode from '../modules/nodes/tpopfreiwkontrFolder'
import tpopfreiwkontrNode from '../modules/nodes/tpopfreiwkontr'
import tpopfreiwkontrzaehlFolderNode from '../modules/nodes/tpopfreiwkontrzaehlFolder'
import tpopfreiwkontrzaehlNode from '../modules/nodes/tpopfreiwkontrzaehl'
import tpopfeldkontrFolderNode from '../modules/nodes/tpopfeldkontrFolder'
import tpopfeldkontrNode from '../modules/nodes/tpopfeldkontr'
import tpopfeldkontrzaehlFolderNode from '../modules/nodes/tpopfeldkontrzaehlFolder'
import tpopfeldkontrzaehlNode from '../modules/nodes/tpopfeldkontrzaehl'
import tpopmassnberFolderNode from '../modules/nodes/tpopmassnberFolder'
import tpopmassnberNode from '../modules/nodes/tpopmassnber'
import tpopmassnFolderNode from '../modules/nodes/tpopmassnFolder'
import tpopmassnNode from '../modules/nodes/tpopmassn'
import filteredAndSortedProjekt from './table/filteredAndSorted/projekt'
import filteredAndSortedApberuebersicht from './table/filteredAndSorted/apberuebersicht'
import filteredAndSortedAp from './table/filteredAndSorted/ap'
import filteredAndSortedAssozart from './table/filteredAndSorted/assozart'
import filteredAndSortedIdealbiotop from './table/filteredAndSorted/idealbiotop'
import filteredAndSortedBeobNichtZuzuordnen from './table/filteredAndSorted/beobNichtZuzuordnen'
import filteredAndSortedBeobzuordnung from './table/filteredAndSorted/beobzuordnung'
import filteredAndSortedBer from './table/filteredAndSorted/ber'
import filteredAndSortedApber from './table/filteredAndSorted/apber'
import filteredAndSortedErfkrit from './table/filteredAndSorted/erfkrit'
import filteredAndSortedZieljahr from './table/filteredAndSorted/zieljahr'
import filteredAndSortedZiel from './table/filteredAndSorted/ziel'
import filteredAndSortedZielber from './table/filteredAndSorted/zielber'
import filteredAndSortedPop from './table/filteredAndSorted/pop'
import filteredAndSortedPopmassnber from './table/filteredAndSorted/popmassnber'
import filteredAndSortedPopber from './table/filteredAndSorted/popber'
import filteredAndSortedTpop from './table/filteredAndSorted/tpop'
import filteredAndSortedTpopbeob from './table/filteredAndSorted/tpopbeob'
import filteredAndSortedTopber from './table/filteredAndSorted/tpopber'
import filteredAndSortedTpopfreiwkontr from './table/filteredAndSorted/tpopfreiwkontr'
import filteredAndSortedTpopfreiwkontrzaehl from './table/filteredAndSorted/tpopfreiwkontrzaehl'
import filteredAndSortedTpopfeldkontr from './table/filteredAndSorted/tpopfeldkontr'
import filteredAndSortedTpopfeldkontrzaehl from './table/filteredAndSorted/tpopfeldkontrzaehl'
import filteredAndSortedTpopmassnber from './table/filteredAndSorted/tpopmassnber'
import filteredAndSortedTpopmassn from './table/filteredAndSorted/tpopmassn'
import deleteBeobzuordnung from './action/deleteBeobzuordnung'
import setActiveBaseLayer from './action/setActiveBaseLayer'
import moveOverlay from './action/moveOverlay'
import moveApfloraLayer from './action/moveApfloraLayer'
import tpopIdsInsideFeatureCollection from '../modules/tpopIdsInsideFeatureCollection'
import popIdsInsideFeatureCollection from '../modules/popIdsInsideFeatureCollection'
import beobNichtBeurteiltIdsInsideFeatureCollection from '../modules/beobNichtBeurteiltIdsInsideFeatureCollection'
import beobNichtZuzuordnenIdsInsideFeatureCollection from '../modules/beobNichtZuzuordnenIdsInsideFeatureCollection'
import tpopBeobIdsInsideFeatureCollection from '../modules/tpopBeobIdsInsideFeatureCollection'
import writeToStore from '../modules/writeToStore'

import TableStore from './table'
import ObservableHistory from './ObservableHistory'

function Store() {
  this.history = ObservableHistory
  this.loading = []
  this.activeUrlElements = {}
  this.urlQuery = {}
  extendObservable(this, {
    loading: [],
  })
  this.node = {
    apFilter: false,
    nodeLabelFilter: {},
    nodeMapFilter: {
      filter: {
        features: []
      },
      pop: [],
      tpop: [],
      beobNichtZuzuordnen: [],
      beobNichtBeurteilt: [],
      tpopBeob: [],
    },
    applyMapFilterToTree: false,
    applyMapFilterToExport: false,
    node: {
      node: {
        nodes: [],
      }
    }
  }
  this.dropdownList = {
    adressen: [],
    apUmsetzungen: [],
    apStati: [],
    artListForAp: [],
    artnamen: [],
    popEntwicklungWerte: [],
    tpopEntwicklungWerte: [],
    apErfkritWerte: [],
    tpopmassnErfbeurtWerte: [],
    tpopApBerichtRelevantWerte: [],
    gemeinden: [],
    idbiotopuebereinstWerte: [],
    lr: [],
    zaehleinheitWerte: [],
    methodeWerte: [],
    tpopMassnTypWerte: [],
    zielTypWerte: [],
  }
  extendObservable(this.dropdownList, {
    adressen: computed(
      () => {
        const adressen = sortBy(
          Array.from(this.table.adresse.values()),
          `AdrName`
        )
        adressen.unshift({
          id: null,
          AdrName: ``,
        })
        return adressen
      },
      { name: `dropdownListAdressen` }
    ),
    apUmsetzungen: computed(
      () => {
        let apUmsetzungen = Array.from(
          this.table.ap_umsetzung_werte.values()
        )
        apUmsetzungen = sortBy(apUmsetzungen, `DomainOrd`)
        return apUmsetzungen.map(el => ({
          value: el.DomainCode,
          label: el.DomainTxt,
        }))
      },
      { name: `dropdownListApUmsetzungen` }
    ),
    apStati: computed(
      () => {
        let apStati = Array.from(
          this.table.ap_bearbstand_werte.values()
        )
        apStati = sortBy(apStati, `DomainOrd`)
        return apStati.map(el => ({
          value: el.DomainCode,
          label: el.DomainTxt,
        }))
      },
      { name: `dropdownListApStati` }
    ),
    artListForAp: computed(
      () => {
        const alreadyUsedApIds = Array.from(this.table.ap.keys()).map(a => Number(a))
        // let user choose this ApArtId
        const apArtIdsNotToShow = alreadyUsedApIds
          .filter(r => r !== this.activeUrlElements.ap)
        const artList = filter(
          Array.from(this.table.adb_eigenschaften.values()),
          r => !apArtIdsNotToShow.includes(r.TaxonomieId)
        )
        return sortBy(artList, `Artname`)
      },
      { name: `dropdownListArtListForAp` }
    ),
    artnamen: computed(
      () => {
        let artnamen = Array.from(
          this.table.adb_eigenschaften.values()
        )
        artnamen = artnamen.map(a => a.Artname).sort()
        // artnamen.unshift(``)
        return artnamen
      },
      { name: `dropdownListArtnamen` }
    ),
    popEntwicklungWerte: computed(
      () => {
        let popEntwicklungWerte = Array.from(this.table.pop_entwicklung_werte.values())
        popEntwicklungWerte = sortBy(popEntwicklungWerte, `EntwicklungOrd`)
        return popEntwicklungWerte.map(el => ({
          value: el.EntwicklungId,
          label: el.EntwicklungTxt,
        }))
      },
      { name: `dropdownListPopEntwicklungWerte` }
    ),
    tpopEntwicklungWerte: computed(
      () => {
        let tpopEntwicklungWerte = Array.from(
          this.table.tpop_entwicklung_werte.values()
        )
        tpopEntwicklungWerte = sortBy(tpopEntwicklungWerte, `EntwicklungOrd`)
        return tpopEntwicklungWerte.map(el => ({
          value: el.EntwicklungCode,
          label: el.EntwicklungTxt,
        }))
      },
      { name: `dropdownListTpopEntwicklungWerte` }
    ),
    apErfkritWerte: computed(
      () => {
        let apErfkritWerte = Array.from(
          this.table.ap_erfkrit_werte.values()
        )
        apErfkritWerte = sortBy(apErfkritWerte, `BeurteilOrd`)
        return apErfkritWerte.map(el => ({
          value: el.BeurteilId,
          label: el.BeurteilTxt,
        }))
      },
      { name: `dropdownListApErfkritWerte` }
    ),
    tpopmassnErfbeurtWerte: computed(
      () => {
        let tpopmassnErfbeurtWerte = Array.from(this.table.tpopmassn_erfbeurt_werte.values())
        tpopmassnErfbeurtWerte = sortBy(tpopmassnErfbeurtWerte, `BeurteilOrd`)
        return tpopmassnErfbeurtWerte.map(el => ({
          value: el.BeurteilId,
          label: el.BeurteilTxt,
        }))
      },
      { name: `dropdownListTpopmassnErfbeurtWerte` }
    ),
    tpopApBerichtRelevantWerte: computed(
      () => {
        const tpopApBerichtRelevantWerte = Array.from(
          this.table.tpop_apberrelevant_werte.values()
        )
        return tpopApBerichtRelevantWerte.map(t => ({
          value: t.DomainCode,
          label: t.DomainTxt,
        }))
      },
      { name: `dropdownListTpopApBerichtRelevantWerte` }
    ),
    gemeinden: computed(
      () => {
        let gemeinden = Array.from(
          this.table.gemeinde.values()
        )
        gemeinden = sortBy(gemeinden, `GmdName`)
        return gemeinden.map(el => el.GmdName)
      },
      { name: `dropdownListGemeinden` }
    ),
    idbiotopuebereinstWerte: computed(
      () => {
        let idbiotopuebereinstWerte = Array.from(this.table.tpopkontr_idbiotuebereinst_werte.values())
        idbiotopuebereinstWerte = sortBy(idbiotopuebereinstWerte, `DomainOrd`)
        return idbiotopuebereinstWerte.map(el => ({
          value: el.DomainCode,
          label: el.DomainTxt,
        }))
      },
      { name: `dropdownListIdbiotopuebereinstWerte` }
    ),
    lr: computed(
      () => {
        let lr = Array.from(this.table.adb_lr.values())
        // eslint-disable-next-line no-regex-spaces
        return lr.map(e => e.Einheit.replace(/  +/g, ` `))
      },
      { name: `dropdownListLr` }
    ),
    zaehleinheitWerte: computed(
      () => {
        let zaehleinheitWerte = Array.from(
          this.table.tpopkontrzaehl_einheit_werte.values()
        )
        zaehleinheitWerte = sortBy(zaehleinheitWerte, `ZaehleinheitOrd`)
        zaehleinheitWerte = zaehleinheitWerte.map(el => ({
          value: el.ZaehleinheitCode,
          label: el.ZaehleinheitTxt,
        }))
        zaehleinheitWerte.unshift({
          value: null,
          label: ``,
        })
        return zaehleinheitWerte
      },
      { name: `dropdownListZaehleinheitWerte` }
    ),
    methodeWerte: computed(
      () => {
        let methodeWerte = Array.from(
          this.table.tpopkontrzaehl_methode_werte.values()
        )
        methodeWerte = sortBy(methodeWerte, `BeurteilOrd`)
        methodeWerte = methodeWerte.map(el => ({
          value: el.BeurteilCode,
          label: el.BeurteilTxt,
        }))
        return methodeWerte
      },
      { name: `dropdownListMethodeWerte` }
    ),
    tpopMassnTypWerte: computed(
      () => {
        let tpopMassnTypWerte = Array.from(
          this.table.tpopmassn_typ_werte.values()
        )
        tpopMassnTypWerte = sortBy(tpopMassnTypWerte, `MassnTypOrd`)
        return tpopMassnTypWerte.map(el => ({
          value: el.MassnTypCode,
          label: el.MassnTypTxt,
        }))
      },
      { name: `dropdownListTpopMassnTypWerte` }
    ),
    zielTypWerte: computed(
      () => {
        let zielTypWerte = Array.from(
          this.table.ziel_typ_werte.values()
        )
        zielTypWerte = sortBy(zielTypWerte, `ZieltypOrd`)
        return zielTypWerte.map(el => ({
          value: el.ZieltypId,
          label: el.ZieltypTxt,
        }))
      },
      { name: `dropdownListZielTypWerte` }
    ),
  })
  extendObservable(this.node, {
    apFilter: false,
    nodeLabelFilter: observable.map({}),
    updateLabelFilter: action(`updateLabelFilter`, (table, value) => {
      if (!table) {
        return this.listError(
          new Error(`nodeLabelFilter cant be updated: no table passed`)
        )
      }
      this.node.nodeLabelFilter.set(table, value)
    }),
    nodeMapFilter: {
      filter: {
        features: [],
      },
      pop: computed(
        () => popIdsInsideFeatureCollection(this),
        { name: `nodeMapFilterPop` }
      ),
      tpop: computed(
        () => tpopIdsInsideFeatureCollection(this),
        { name: `nodeMapFilterTpop` }
      ),
      beobNichtBeurteilt: computed(
        () => beobNichtBeurteiltIdsInsideFeatureCollection(this),
        { name: `nodeMapFilterBeobNichtBeurteilt` }
      ),
      beobNichtZuzuordnen: computed(
        () => beobNichtZuzuordnenIdsInsideFeatureCollection(this),
        { name: `nodeMapFilterBeobNichtZuzuordnen` }
      ),
      tpopBeob: computed(
        () => tpopBeobIdsInsideFeatureCollection(this),
        { name: `nodeMapFilterPTpopBeob` }
      ),
    },
    applyMapFilterToTree: false,
    toggleApplyMapFilterToTree: action(
      `toggleApplyMapFilterToTree`,
      () => this.node.applyMapFilterToTree = !this.node.applyMapFilterToTree
    ),
    applyMapFilterToExport: false,
    toggleApplyMapFilterToExport: action(
      `toggleApplyMapFilterToExport`,
      () => this.node.applyMapFilterToExport = !this.node.applyMapFilterToExport
    ),
    updateMapFilter: action(`updateMapFilter`, (mapFilterItems) => {
      this.node.nodeMapFilter.filter = mapFilterItems.toGeoJSON()
    }),
    // action when user clicks on a node in the tree
    toggleNode: action(`toggleNode`, node =>
      toggleNode(this, node)
    ),
  })
  extendObservable(this.node.node, {
    projekt: computed(
      () => projektNodes(this),
      { name: `` }
    ),
    apFolder: computed(
      () => apFolderNodes(this),
      { name: `apFolderNode` }
    ),
    apberuebersichtFolder: computed(
      () => apberuebersichtFolderNodes(this),
      { name: `apberuebersichtFolderNode` }
    ),
    exporteFolder: computed(
      () => exporteFolderNodes(this),
      { name: `exporteFolderNode` }
    ),
    apberuebersicht: computed(
      () => apberuebersichtNodes(this),
      { name: `apberuebersichtNode` }
    ),
    ap: computed(
      () => apNodes(this),
      { name: `apNode` }
    ),
    nodes: computed(
      () => allNodes(this),
      { name: `nodesNode` }
    ),
    qkFolder: computed(
      () => qkFolderNode(this),
    ),
    assozartFolder: computed(
      () => assozartFolderNode(this),
      { name: `assozartFolderNode` }
    ),
    assozart: computed(
      () => assozartNode(this),
      { name: `assozartNode` }
    ),
    idealbiotopFolder: computed(
      () => idealbiotopFolderNode(this),
      { name: `idealbiotopFolderNode` }
    ),
    beobNichtZuzuordnenFolder: computed(
      () => beobNichtZuzuordnenFolderNode(this),
      { name: `beobNichtZuzuordnenFolderNode` }
    ),
    beobNichtZuzuordnen: computed(
      () => beobNichtZuzuordnenNode(this),
      { name: `beobNichtZuzuordnenNode` }
    ),
    beobzuordnungFolder: computed(
      () => beobzuordnungFolderNode(this),
      { name: `beobzuordnungFolderNode` }
    ),
    beobzuordnung: computed(
      () => beobzuordnungNode(this),
      { name: `beobzuordnungNode` }
    ),
    berFolder: computed(
      () => berFolderNode(this),
      { name: `berFolderNode` }
    ),
    ber: computed(
      () => berNode(this),
      { name: `berNode` }
    ),
    apberFolder: computed(
      () => apberFolderNode(this),
      { name: `apberFolderNode` }
    ),
    apber: computed(
      () => apberNode(this),
      { name: `apberNode` }
    ),
    erfkritFolder: computed(
      () => erfkritFolderNode(this),
      { name: `erfkritFolderNode` }
    ),
    erfkrit: computed(
      () => erfkritNode(this),
      { name: `erfkritNode` }
    ),
    zieljahrFolder: computed(
      () => zieljahreFolderNode(this),
      { name: `zieljahrFolderNode` }
    ),
    zieljahr: computed(
      () => zieljahrNode(this),
      { name: `zieljahrNode` }
    ),
    ziel: computed(
      () => zielNode(this),
      { name: `zielNode` }
    ),
    zielberFolder: computed(
      () => zielberFolderNode(this),
      { name: `zielberFolderNode` }
    ),
    zielber: computed(
      () => zielberNode(this),
      { name: `zielberNode` }
    ),
    popFolder: computed(
      () => popFolderNode(this),
      { name: `popFolderNode` }
    ),
    pop: computed(
      () => popNode(this),
      { name: `popNode` }
    ),
    popmassnberFolder: computed(
      () => popmassnberFolderNode(this),
      { name: `popmassnberFolderNode` }
    ),
    popmassnber: computed(
      () => popmassnberNode(this),
      { name: `popmassnberNode` }
    ),
    popberFolder: computed(
      () => popberFolderNode(this),
      { name: `popberFolderNode` }
    ),
    popber: computed(
      () => popberNode(this),
      { name: `popberNode` }
    ),
    tpopFolder: computed(
      () => tpopFolderNode(this),
      { name: `tpopFolderNode` }
    ),
    tpop: computed(
      () => tpopNode(this),
      { name: `tpopNode` }
    ),
    tpopbeobFolder: computed(
      () => tpopbeobFolderNode(this),
      { name: `tpopbeobFolderNode` }
    ),
    tpopbeob: computed(
      () => tpopbeobNode(this),
      { name: `tpopbeobNode` }
    ),
    tpopberFolder: computed(
      () => tpopberFolderNode(this),
      { name: `tpopberFolderNode` }
    ),
    tpopber: computed(
      () => tpopberNode(this),
      { name: `tpopberNode` }
    ),
    tpopfreiwkontrFolder: computed(
      () => tpopfreiwkontrFolderNode(this),
      { name: `tpopfreiwkontrFolderNode` }
    ),
    tpopfreiwkontr: computed(
      () => tpopfreiwkontrNode(this),
      { name: `tpopfreiwkontrNode` }
    ),
    tpopfreiwkontrzaehlFolder: computed(
      () => tpopfreiwkontrzaehlFolderNode(this),
      { name: `tpopfreiwkontrzaehlFolderNode` }
    ),
    tpopfreiwkontrzaehl: computed(
      () => tpopfreiwkontrzaehlNode(this),
      { name: `tpopfreiwkontrzaehlNode` }
    ),
    tpopfeldkontrFolder: computed(
      () => tpopfeldkontrFolderNode(this),
      { name: `tpopfeldkontrFolderNode` }
    ),
    tpopfeldkontr: computed(
      () => tpopfeldkontrNode(this),
      { name: `tpopfeldkontrNode` }
    ),
    tpopfeldkontrzaehlFolder: computed(
      () => tpopfeldkontrzaehlFolderNode(this),
      { name: `tpopfeldkontrzaehlFolderNode` }
    ),
    tpopfeldkontrzaehl: computed(
      () => tpopfeldkontrzaehlNode(this),
      { name: `tpopfeldkontrzaehlNode` }
    ),
    tpopmassnberFolder: computed(
      () => tpopmassnberFolderNode(this),
      { name: `tpopmassnberFolderNode` }
    ),
    tpopmassnber: computed(
      () => tpopmassnberNode(this),
      { name: `tpopmassnberNode` }
    ),
    tpopmassnFolder: computed(
      () => tpopmassnFolderNode(this),
      { name: `tpopmassnFolderNode` }
    ),
    tpopmassn: computed(
      () => tpopmassnNode(this),
      { name: `tpopmassnNode` }
    ),
  })
  this.ui = {}
  extendObservable(this.ui, {
    windowWidth: $(window).width(),
    windowHeight: $(window).height(),
    treeHeight: 0,
    lastClickY: 0,
    treeTopPosition: 0,
  })
  this.app = {}
  extendObservable(this.app, {
    errors: [],
    fields: [],
  })
  this.user = {}
  // name set to prevent Login Dialog from appearing before setLoginFromIdb has fetched from idb
  extendObservable(this.user, {
    name: `temporaryValue`,
    roles: [],
    readOnly: true,
  })
  this.map = {
    bounds: [],
    mouseCoord: [],
    mouseCoordEpsg21781: [],
    pop: {},
    tpop: {},
    beob: {},
    beobNichtBeurteilt: {},
    beobNichtZuzuordnen: {},
    tpopBeob: {},
    activeBaseLayer: `OsmColor`,
    activeOverlays: [],
    activeApfloraLayers: [],
    activeOverlaysSorted: [],
    activeApfloraLayersSorted: [],
    overlays: [],
    apfloraLayers: [],
    addActiveOverlay: () => {},
    removeActiveOverlay: () => {},
    setActiveBaseLayer: () => {},
    addActiveApfloraLayer: () => {},
    removeActiveApfloraLayer: () => {},
  }
  extendObservable(this.map, {
    bounds: [[47.159, 8.354], [47.696, 8.984]],
    changeBounds: action(`changeBounds`, (bounds) => this.map.bounds = bounds),
    mouseCoord: [],
    mouseCoordEpsg21781: computed(
      () => {
        if (this.map.mouseCoord.length > 0) {
          return epsg4326to21781(this.map.mouseCoord[0], this.map.mouseCoord[1])
        }
        return []
      },
      { name: `mouseCoordEpsg21781` }
    ),
    activeBaseLayer: `OsmColor`,
    setActiveBaseLayer: action(`setActiveBaseLayer`, (layer) => setActiveBaseLayer(this, layer)),
    overlays: observable([
      { label: `ZH Übersichtsplan`, value: `ZhUep` },
      { label: `Detailplaene`, value: `Detailplaene` },
      { label: `ZH Gemeindegrenzen`, value: `ZhGemeindegrenzen` },
      { label: `SVO grau`, value: `ZhSvoGrey` },
      { label: `SVO farbig`, value: `ZhSvoColor` },
      { label: `Lebensraum- und Vegetationskartierungen`, value: `ZhLrVegKartierungen` },
      { label: `Wälder: lichte`, value: `ZhLichteWaelder` },
      { label: `Wälder: Vegetation`, value: `ZhWaelderVegetation` },
    ]),
    overlaysString: computed(
      () => this.map.overlays.map(o => o.value).join(),
      { name: `computed` }
    ),
    moveOverlay: action(`moveOverlay`, ({ oldIndex, newIndex }) =>
      moveOverlay(this, oldIndex, newIndex)
    ),
    activeOverlays: [],
    activeOverlaysSorted: computed(
      () => sortBy(this.map.activeOverlays, (activeOverlay) =>
        this.map.overlays.findIndex((overlay) => overlay.value === activeOverlay)
      ),
      { name: `activeOverlaysSorted` }
    ),
    activeOverlaysSortedString: computed(
      () => this.map.activeOverlaysSorted.join(),
      { name: `activeOverlaysSortedString` }
    ),
    addActiveOverlay: action(`addActiveOverlay`, layer => this.map.activeOverlays.push(layer)),
    removeActiveOverlay: action(`removeActiveOverlay`, (layer) => {
      this.map.activeOverlays = this.map.activeOverlays.filter(o => o !== layer)
    }),
    apfloraLayers: observable([
      { label: `Populationen`, value: `Pop` },
      { label: `Teil-Populationen`, value: `Tpop` },
      { label: `Beobachtungen: zugeordnet`, value: `TpopBeob` },
      { label: `Beobachtungen: nicht beurteilt`, value: `BeobNichtBeurteilt` },
      { label: `Beobachtungen: nicht zuzuordnen`, value: `BeobNichtZuzuordnen` },
      { label: `Zuordnungs-Linien`, value: `TpopBeobAssignPolylines` },
    ]),
    apfloraLayersString: computed(
      () => this.map.apfloraLayers.map(o => o.value).join(),
      { name: `apfloraLayersString` }
    ),
    moveApfloraLayer: action(`moveApfloraLayer`, ({ oldIndex, newIndex }) =>
      moveApfloraLayer(this, oldIndex, newIndex)
    ),
    activeApfloraLayers: [],
    activeApfloraLayersSorted: computed(
      () => sortBy(this.map.activeApfloraLayers, (activeApfloraLayer) =>
        this.map.apfloraLayers.findIndex((apfloraLayer) =>
          apfloraLayer.value === activeApfloraLayer
        )
      ),
      { name: `activeApfloraLayersSorted` }
    ),
    activeApfloraLayersSortedString: computed(
      () => this.map.activeApfloraLayersSorted.join(),
      { name: `activeApfloraLayersSortedString` }
    ),
    addActiveApfloraLayer: action(`addActiveApfloraLayer`, layer =>
      this.map.activeApfloraLayers.push(layer)
    ),
    removeActiveApfloraLayer: action(`removeActiveApfloraLayer`, (layer) => {
      this.map.activeApfloraLayers = this.map.activeApfloraLayers.filter(o => o !== layer)
    }),
    showMapLayer: action(`showMapLayer`, (layer, bool) => {
      if (bool) {
        this.map.addActiveOverlay(layer)
      } else {
        this.map.removeActiveOverlay(layer)
      }
    }),
    showMapApfloraLayer: action(`showMapApfloraLayer`, (layer, bool) => {
      if (bool) {
        this.map.addActiveApfloraLayer(layer)
      } else {
        this.map.removeActiveApfloraLayer(layer)
      }
    }),
    setIdOfTpopBeingLocalized: action(`setIdOfTpopBeingLocalized`, (id) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      this.map.tpop.idOfTpopBeingLocalized = id
    }),
    localizeTpop: action(`localizeTpop`, (x, y) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      localizeTpop(this, x, y)
    }),
    setMapMouseCoord: action(`setMapMouseCoord`, (e) => {
      this.map.mouseCoord = [e.latlng.lng, e.latlng.lat]
    }),
    toggleMapPopLabelContent: action(`toggleMapPopLabelContent`, (layer) =>
      this.map[layer].labelUsingNr = !this.map[layer].labelUsingNr
    ),
  })
  extendObservable(this.map.pop, {
    // apArtId is needed because
    // need to pass apArtId when activeUrlElements.ap
    // is not yet set...
    apArtId: null,
    highlightedIds: computed(
      () => {
        const nodeMapFilterPop = this.node.nodeMapFilter.pop
        if (nodeMapFilterPop.length > 0) {
          return nodeMapFilterPop
        }
        if (this.activeUrlElements.pop) {
          return [this.activeUrlElements.pop]
        }
        return []
      },
      { name: `highlightedIds` }
    ),
    pops: computed(() =>
      getPopsForMap(this),
      { name: `mapPops` }
    ),
    bounds: computed(() =>
      getPopBounds(this.map.pop.pops),
      { name: `mapPopBounds` }
    ),
    boundsOfHighlightedIds: computed(
      () => getPopBounds(
        this.map.pop.pops
          .filter(p => this.map.pop.highlightedIds.includes(p.PopId))
      ),
      { name: `mapPopBoundsOfHighlightedIds` }
    ),
    // alternative is using names
    labelUsingNr: true,
    markers: computed(() =>
      getPopMarkers(this),
      { name: `mapPopMarkers` }
    ),
  })
  extendObservable(this.map.tpop, {
    highlightedIds: computed(
      () => {
        const nodeMapFilterTpop = this.node.nodeMapFilter.tpop
        if (nodeMapFilterTpop.length > 0) {
          return nodeMapFilterTpop
        }
        if (this.activeUrlElements.tpop) {
          return [this.activeUrlElements.tpop]
        }
        return []
      },
      { name: `mapTpopHighlightedIds` }
    ),
    highlightedPopIds: [],
    tpops: computed(() =>
      getTpopsForMap(this),
      { name: `mapTpopTpops` }
    ),
    bounds: computed(() =>
      getTpopBounds(this.map.tpop.tpops),
      { name: `mapTpopBounds` }
    ),
    boundsOfHighlightedIds: computed(
      () => getTpopBounds(
        this.map.tpop.tpops
          .filter(t => this.map.tpop.highlightedIds.includes(t.TPopId))
      ),
      { name: `mapTpopBoundsOfHighlightedIds` }
    ),
    // alternative is using names
    labelUsingNr: true,
    markers: computed(() =>
      getTpopMarkers(this),
      { name: `mapTpopMarkers` }
    ),
    markersClustered: computed(() =>
      getTpopMarkersClustered(this),
      { name: `mapTpopMarkersClustered` }
    ),
    idOfTpopBeingLocalized: 0,
  })
  extendObservable(this.map.beob, {
    highlightedIds: [],
    beobs: computed(() =>
      getBeobForMap(this),
      { name: `mapBeobBeobs` }
    ),
    markersClustered: computed(
      () => getBeobMarkersClustered(this),
      { name: `mapBeobMarkersClustered` }
    ),
    markers: computed(
      () => getBeobMarkers(this),
      { name: `mapBeobMarkers` }
    ),
    assigning: false,
    toggleAssigning: action(`toggleAssigning`, () =>
      this.map.beob.assigning = !this.map.beob.assigning
    ),
  })
  extendObservable(this.map.beobNichtBeurteilt, {
    highlightedIds: computed(
      () => {
        const nodeMapFilterBeobNichtBeurteilt = this.node.nodeMapFilter.beobNichtBeurteilt
        if (nodeMapFilterBeobNichtBeurteilt.length > 0) {
          return nodeMapFilterBeobNichtBeurteilt
        }
        if (this.activeUrlElements.beobzuordnung) {
          return [this.activeUrlElements.beobzuordnung]
        }
        return []
      },
      { name: `mapBeobNichtBeurteiltHighlightedIds` }
    ),
    markersClustered: computed(
      () => getBeobNichtBeurteiltMarkersClustered(this),
      { name: `mapBeobNichtBeurteiltMarkersClustered` }
    ),
    markers: computed(
      () => getBeobNichtBeurteiltMarkers(this),
      { name: `mapBeobNichtBeurteiltMarkers` }
    ),
    beobs: computed(
      () => getBeobForMap(this).filter(b =>
        !b.beobzuordnung ||
        (!b.beobzuordnung.BeobNichtZuordnen && !b.beobzuordnung.TPopId)
      ),
      { name: `mapBeobNichtBeurteiltBeobs` }
    ),
    bounds: computed(
      () => getBeobNichtBeurteiltBounds(this.map.beobNichtBeurteilt.beobs),
      { name: `mapBeobNichtBeurteiltBounds` }
    ),
    boundsOfHighlightedIds: computed(
      () => getBeobNichtBeurteiltBounds(
        this.map.beobNichtBeurteilt.beobs
          .filter(b => this.map.beobNichtBeurteilt.highlightedIds.includes(b.BeobId))
      ),
      { name: `mapBeobNichtBeurteiltBoundsOfHighlightedIds` }
    ),
    idOfBeobBeingAssigned: 0,
  })
  extendObservable(this.map.beobNichtZuzuordnen, {
    highlightedIds: computed(
      () => {
        const nodeMapFilterBeobNichtZuzuordnen = this.node.nodeMapFilter.beobNichtZuzuordnen
        if (nodeMapFilterBeobNichtZuzuordnen.length > 0) {
          return nodeMapFilterBeobNichtZuzuordnen
        }
        if (this.activeUrlElements.beobNichtZuzuordnen) {
          return [this.activeUrlElements.beobNichtZuzuordnen]
        }
        return []
      },
      { name: `mapBeobNichtZuzuordnenHighlightedIds` }
    ),
    markersClustered: computed(
      () => getBeobNichtZuzuordnenMarkersClustered(this),
      { name: `mapBeobNichtZuzuordnenMarkersClustered` }
    ),
    beobs: computed(
      () => getBeobForMap(this)
        .filter(b => b.beobzuordnung && b.beobzuordnung.BeobNichtZuordnen === 1),
      { name: `mapBeobNichtZuzuordnenBeobs` }
    ),
    bounds: computed(
      () => getBeobNichtZuzuordnenBounds(this.map.beobNichtZuzuordnen.beobs),
    { name: `mapBeobNichtZuzuordnenBounds` }
    ),
    boundsOfHighlightedIds: computed(
      () => getBeobNichtZuzuordnenBounds(
        this.map.beobNichtZuzuordnen.beobs
          .filter(b =>
            this.map.beobNichtZuzuordnen.highlightedIds.includes(
              isNaN(b.BeobId) ? b.BeobId : Number(b.BeobId)
            )
          )
      ),
      { name: `mapBeobNichtZuzuordnenBoundsOfHighlightedIds` }
    ),
  })
  extendObservable(this.map.tpopBeob, {
    highlightedIds: computed(
      () => {
        const { activeUrlElements } = this
        const nodeMapFilterTpopBeob = this.node.nodeMapFilter.tpopBeob
        if (nodeMapFilterTpopBeob.length > 0) {
          return nodeMapFilterTpopBeob
        }
        if (activeUrlElements.tpopbeob) {
          return [activeUrlElements.tpopbeob]
        } else if (activeUrlElements.tpop) {
          return this.map.tpopBeob.beobs.filter(b =>
            b.beobzuordnung && b.beobzuordnung.TPopId === activeUrlElements.tpop
          ).map(b => b.BeobId)
        } else if (activeUrlElements.pop) {
          return this.map.tpopBeob.beobs.filter((b) => {
            const tpop = this.table.tpop.get(b.beobzuordnung.TPopId)
            if (tpop) {
              const popId = tpop.PopId
              return popId && popId === activeUrlElements.pop
            }
            return false
          }).map(b => b.BeobId)
        }
        return []
      },
      { name: `mapTpopBeobHighlightedIds` }
    ),
    markersClustered: computed(
      () => getTpopBeobMarkersClustered(this),
      { name: `mapTpopBeobMarkersClustered` }
    ),
    markers: computed(
      () => getTpopBeobMarkers(this),
      { name: `mapTpopBeobMarkers` }
    ),
    assignPolylines: computed(
      () => getTpopBeobAssignPolylines(this),
      { name: `mapTpopBeobAssignPolylines` }
    ),
    beobs: computed(
      () => getBeobForMap(this).filter(b =>
        b.beobzuordnung &&
        b.beobzuordnung.TPopId &&
        !b.beobzuordnung.BeobNichtZuzuordnen
      ),
      { name: `mapTpopBeobBeobs` }
    ),
    bounds: computed(
      () => getTpopBeobBounds(this.map.tpopBeob.beobs),
      { name: `mapTpopBeobBounds` }
    ),
    boundsOfHighlightedIds: computed(
      () => getTpopBeobBounds(
        this.map.tpopBeob.beobs
          .filter(b => this.map.tpopBeob.highlightedIds.includes(b.BeobId))
      ),
      { name: `mapTpopBeobBoundsOfHighlightedIds` }
    ),
  })
  this.table = TableStore
  extendObservable(this.table.filteredAndSorted, {
    projekt: computed(
      () => filteredAndSortedProjekt(this),
      { name: `projektFilteredAndSorted` }
    ),
    apberuebersicht: computed(
      () => filteredAndSortedApberuebersicht(this),
      { name: `xxxFilteredAndSorted` }
    ),
    ap: computed(
      () => filteredAndSortedAp(this),
      { name: `apFilteredAndSorted` }
    ),
    assozart: computed(
      () => filteredAndSortedAssozart(this),
      { name: `assozartFilteredAndSorted` }
    ),
    idealbiotop: computed(
      () => filteredAndSortedIdealbiotop(this),
      { name: `idealbiotopFilteredAndSorted` }
    ),
    beobNichtZuzuordnen: computed(
      () => filteredAndSortedBeobNichtZuzuordnen(this),
      { name: `beobNichtZuzuordnenFilteredAndSorted` }
    ),
    beobzuordnung: computed(
      () => filteredAndSortedBeobzuordnung(this),
      { name: `beobzuordnungFilteredAndSorted` }
    ),
    ber: computed(
      () => filteredAndSortedBer(this),
      { name: `berFilteredAndSorted` }
    ),
    apber: computed(
      () => filteredAndSortedApber(this),
      { name: `apberFilteredAndSorted` }
    ),
    erfkrit: computed(
      () => filteredAndSortedErfkrit(this),
      { name: `erfkritFilteredAndSorted` }
    ),
    zieljahr: computed(
      () => filteredAndSortedZieljahr(this),
      { name: `zieljahrFilteredAndSorted` }
    ),
    ziel: computed(
      () => filteredAndSortedZiel(this),
      { name: `zielFilteredAndSorted` }
    ),
    zielber: computed(
      () => filteredAndSortedZielber(this),
      { name: `xxxFilteredAndSorted` }
    ),
    pop: computed(
      () => filteredAndSortedPop(this),
      { name: `popFilteredAndSorted` }
    ),
    popmassnber: computed(
      () => filteredAndSortedPopmassnber(this),
      { name: `popmassnberFilteredAndSorted` }
    ),
    popber: computed(
      () => filteredAndSortedPopber(this),
      { name: `popberFilteredAndSorted` }
    ),
    tpop: computed(
      () => filteredAndSortedTpop(this),
      { name: `tpopFilteredAndSorted` }
    ),
    tpopbeob: computed(
      () => filteredAndSortedTpopbeob(this),
      { name: `tpopbeobFilteredAndSorted` }
    ),
    tpopber: computed(
      () => filteredAndSortedTopber(this),
      { name: `tpopberFilteredAndSorted` }
    ),
    tpopfreiwkontr: computed(
      () => filteredAndSortedTpopfreiwkontr(this),
      { name: `tpopfreiwkontrFilteredAndSorted` }
    ),
    tpopfreiwkontrzaehl: computed(
      () => filteredAndSortedTpopfreiwkontrzaehl(this),
      { name: `tpopfreiwkontrzaehlFilteredAndSorted` }
    ),
    tpopfeldkontr: computed(
      () => filteredAndSortedTpopfeldkontr(this),
      { name: `tpopfeldkontrFilteredAndSorted` }
    ),
    tpopfeldkontrzaehl: computed(
      () => filteredAndSortedTpopfeldkontrzaehl(this),
      { name: `tpopfeldkontrzaehlFilteredAndSorted` }
    ),
    tpopmassnber: computed(
      () => filteredAndSortedTpopmassnber(this),
      { name: `tpopmassnberFilteredAndSorted` }
    ),
    tpopmassn: computed(
      () => filteredAndSortedTpopmassn(this),
      { name: `tpopmassnFilteredAndSorted` }
    ),
  })
  this.valuesForWhichTableDataWasFetched = {}
  this.qk = observable.map()
  extendObservable(this, {
    /**
     * url paths are used to control tree and forms
     */
    url: computed(
      //$FlowIssue
      () => getUrl(this.history.location.pathname),
      { name: `url` }
    ),
    /**
     * urlQueries are used to control tabs
     * for instance: Entwicklung or Biotop in tpopfeldkontr
     */
    urlQuery: computed(
      //$FlowIssue
      () => getUrlQuery(this.history.location.search),
      { name: `urlQuery` }
    ),
    projektNodes: computed(
      () => buildProjektNodes(this),
      { name: `projektNodes` }
    ),
    activeDataset: computed(
      () => updateActiveDatasetFromUrl(this),
      { name: `activeDataset` }
    ),
    activeUrlElements: computed(
      () => getActiveUrlElements(this.url),
      { name: `activeUrlElements` }
    ),
    datasetToDelete: {},
    tellUserReadOnly: action(`tellUserReadOnly`, () =>
      this.listError(new Error(`Sie haben keine Schreibrechte`))
    ),
    fetchLogin: action(`fetchLogin`, (name, password) =>
      fetchLogin(this, name, password)
    ),
    logout: action(`logout`, () =>
      logout(this)
    ),
    setLoginFromIdb: action(`setLoginFromIdb`, () =>
      setLoginFromIdb(this)
    ),
    toggleApFilter: action(`toggleApFilter`, () => {
      this.node.apFilter = !this.node.apFilter
    }),
    fetchQk: action(`fetchQk`, () => fetchQk({ store: this })),
    setQk: action(`setQk`, ({ berichtjahr, messages, filter }) =>
      setQk({ store: this, berichtjahr, messages, filter })
    ),
    setQkFilter: action(`setQkFilter`, ({ filter }) =>
      setQkFilter({ store: this, filter })
    ),
    addMessagesToQk: action(`addMessagesToQk`, ({ messages }) => {
      addMessagesToQk({ store: this, messages })
    }),
    fetchFieldsFromIdb: action(`fetchFieldsFromIdb`, () =>
      fetchFieldsFromIdb(this)
    ),
    insertBeobzuordnung: action(`insertBeobzuordnung`, (newKey, newValue) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      insertBeobzuordnung(this, newKey, newValue)
    }),
    insertDataset: action(`insertDataset`, (table, parentId, baseUrl) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      insertDataset(this, table, parentId, baseUrl)
    }),
    deleteDatasetDemand: action(`deleteDatasetDemand`, (table, id, url, label) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      deleteDatasetDemand(this, table, id, url, label)
    }),
    deleteDatasetAbort: action(`deleteDatasetAbort`, () => {
      this.datasetToDelete = {}
    }),
    deleteDatasetExecute: action(`deleteDatasetExecute`, () => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      deleteDatasetExecute(this)
    }),
    deleteBeobzuordnung: action(`deleteBeobzuordnung`, (beobId) =>
      deleteBeobzuordnung(this, beobId)
    ),
    listError: action(`listError`, error =>
      listError(this, error)
    ),
    // updates data in store
    updateProperty: action(`updateProperty`, (key, value) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      updateProperty(this, key, value)
    }),
    // updates data in database
    updatePropertyInDb: action(`updatePropertyInDb`, (key, value) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      updatePropertyInDb(this, key, value)
    }),
    // fetch all data of a table
    // primarily used for werte (domain) tables
    // and projekt
    fetchTable: action(`fetchTable`, (schemaName, tableName) =>
      fetchTable(this, schemaName, tableName)
    ),
    fetchStammdaten: action(`fetchStammdaten`, () => {
      fetchFields(this)
      fetchStammdatenTables(this)
    }),
    fetchBeobzuordnung: action(`fetchBeobzuordnung`, apArtId =>
      fetchBeobzuordnungModule(this, apArtId)
    ),
    // fetch data of table for id of parent table
    // used for actual apflora data (but projekt)
    fetchTableByParentId: action(`fetchTableByParentId`, (schemaName, tableName, parentId) =>
      fetchTableByParentId(this, schemaName, tableName, parentId)
    ),
    fetchTpopForAp: action(`fetchTpopForAp`, apArtId =>
      fetchTpopForAp(this, apArtId)
    ),
    fetchPopForAp: action(`fetchPopForAp`, apArtId =>
      fetchPopForAp(this, apArtId)
    ),
    fetchDatasetById: action(`fetchDatasetById`, ({ schemaName, tableName, id }) =>
      fetchDatasetById({ store: this, schemaName, tableName, id })
    ),
    fetchBeobBereitgestellt: action(`fetchBeobBereitgestellt`, apArtId =>
      fetchBeobBereitgestellt(this, apArtId)
    ),
    fetchBeobEvab: action(`fetchBeobEvab`, apArtId =>
      fetchBeobEvab(this, apArtId)
    ),
    fetchBeobInfospezies: action(`fetchBeobInfospezies`, apArtId =>
      fetchBeobInfospezies(this, apArtId)
    ),
    writeToStore: action(
      `writeToStore`,
      ({ data, table, field }) => writeToStore({ store: this, data, table, field })
    ),
    /**
     * urlQueries are used to control tabs
     * for instance: Entwicklung or Biotop in tpopfeldkontr
     * or: strukturbaum, daten and map in projekte
     */
    setUrlQuery: action(`setUrlQuery`, (key, value) =>
      setUrlQuery(this, key, value)
    ),
  })
}

const MyStore = new Store()

// don't know why but combining this with last extend call
// creates an error in an autorun
// maybe needed actions are not part of Store yet?
extendObservable(
  MyStore,
  {
    manipulateUrl: autorun(
      `manipulateUrl`,
      () => manipulateUrl(MyStore)
    ),
    reactWhenUrlHasChanged: autorunAsync(
      `reactWhenUrlHasChanged`,
      () => {
        // need to pass visibility of layers to make data fetched on changing layers
        const showTpop = MyStore.map.activeApfloraLayers.includes(`Tpop`)
        const showPop = MyStore.map.activeApfloraLayers.includes(`Pop`)
        const showTpopBeob = MyStore.map.activeApfloraLayers.includes(`TpopBeob`) || MyStore.map.activeApfloraLayers.includes(`TpopBeobAssignPolylines`)
        const showBeobNichtBeurteilt = MyStore.map.activeApfloraLayers.includes(`BeobNichtBeurteilt`)
        const showBeobNichtZuzuordnen = MyStore.map.activeApfloraLayers.includes(`BeobNichtZuzuordnen`)
        fetchDataForActiveUrlElements(MyStore, showPop, showTpop, showTpopBeob, showBeobNichtBeurteilt, showBeobNichtZuzuordnen)
      }
    ),
  }
)

export default MyStore
