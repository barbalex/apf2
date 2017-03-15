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
import epsg4326to21781 from '../modules/epsg4326to21781'
import getPopMarkers from '../modules/getPopMarkers'
import getTpopMarkers from '../modules/getTpopMarkers'
import getBeobMarkersClustered from '../modules/getBeobMarkersClustered'
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

import TableStore from './table'
import ObservableHistory from './ObservableHistory'

function Store() {
  this.history = ObservableHistory
  this.loading = []
  extendObservable(this, {
    loading: [],
  })
  this.node = {
    node: {}
  }
  extendObservable(this.node, {
    apFilter: false,
    nodeLabelFilter: observable.map({}),
  })
  extendObservable(this.node.node, {
    projekt: computed(() => projektNodes(this)),
    apFolder: computed(() => apFolderNodes(this)),
    apberuebersichtFolder: computed(() => apberuebersichtFolderNodes(this)),
    exporteFolder: computed(() => exporteFolderNodes(this)),
    apberuebersicht: computed(() => apberuebersichtNodes(this)),
    ap: computed(() => apNodes(this)),
    nodes: computed(() => allNodes(this)),
    qkFolder: computed(() => qkFolderNode(this)),
    assozartFolder: computed(() => assozartFolderNode(this)),
    assozart: computed(() => assozartNode(this)),
    idealbiotopFolder: computed(() => idealbiotopFolderNode(this)),
    beobNichtZuzuordnenFolder: computed(() => beobNichtZuzuordnenFolderNode(this)),
    beobNichtZuzuordnen: computed(() => beobNichtZuzuordnenNode(this)),
    beobzuordnungFolder: computed(() => beobzuordnungFolderNode(this)),
    beobzuordnung: computed(() => beobzuordnungNode(this)),
    berFolder: computed(() => berFolderNode(this)),
    ber: computed(() => berNode(this)),
    apberFolder: computed(() => apberFolderNode(this)),
    apber: computed(() => apberNode(this)),
    erfkritFolder: computed(() => erfkritFolderNode(this)),
    erfkrit: computed(() => erfkritNode(this)),
    zieljahrFolder: computed(() => zieljahreFolderNode(this)),
    zieljahr: computed(() => zieljahrNode(this)),
    ziel: computed(() => zielNode(this)),
    zielberFolder: computed(() => zielberFolderNode(this)),
    zielber: computed(() => zielberNode(this)),
    popFolder: computed(() => popFolderNode(this)),
    pop: computed(() => popNode(this)),
    popmassnberFolder: computed(() => popmassnberFolderNode(this)),
    popmassnber: computed(() => popmassnberNode(this)),
    popberFolder: computed(() => popberFolderNode(this)),
    popber: computed(() => popberNode(this)),
    tpopFolder: computed(() => tpopFolderNode(this)),
    tpop: computed(() => tpopNode(this)),
    tpopbeobFolder: computed(() => tpopbeobFolderNode(this)),
    tpopbeob: computed(() => tpopbeobNode(this)),
    tpopberFolder: computed(() => tpopberFolderNode(this)),
    tpopber: computed(() => tpopberNode(this)),
    tpopfreiwkontrFolder: computed(() => tpopfreiwkontrFolderNode(this)),
    tpopfreiwkontr: computed(() => tpopfreiwkontrNode(this)),
    tpopfreiwkontrzaehlFolder: computed(() => tpopfreiwkontrzaehlFolderNode(this)),
    tpopfreiwkontrzaehl: computed(() => tpopfreiwkontrzaehlNode(this)),
    tpopfeldkontrFolder: computed(() => tpopfeldkontrFolderNode(this)),
    tpopfeldkontr: computed(() => tpopfeldkontrNode(this)),
    tpopfeldkontrzaehlFolder: computed(() => tpopfeldkontrzaehlFolderNode(this)),
    tpopfeldkontrzaehl: computed(() => tpopfeldkontrzaehlNode(this)),
    tpopmassnberFolder: computed(() => tpopmassnberFolderNode(this)),
    tpopmassnber: computed(() => tpopmassnberNode(this)),
    tpopmassnFolder: computed(() => tpopmassnFolderNode(this)),
    tpopmassn: computed(() => tpopmassnNode(this)),
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
    mouseCoord: [],
    mouseCoordEpsg21781: [],
    pop: {},
    tpop: {},
    beob: {},
  }
  extendObservable(this.map, {
    mouseCoord: [],
    mouseCoordEpsg21781: computed(() => {
      if (this.map.mouseCoord.length > 0) {
        return epsg4326to21781(this.map.mouseCoord[0], this.map.mouseCoord[1])
      }
      return []
    }),
  })
  extendObservable(this.map.pop, {
    // apArtId is needed because
    // need to pass apArtId when activeUrlElements.ap
    // is not yet set...
    apArtId: null,
    visible: false,
    highlightedIds: [],
    pops: computed(() => getPopsForMap(this)),
    bounds: computed(() => getPopBounds(this.map.pop.pops)),
    // alternative is using names
    labelUsingNr: true,
    markers: computed(() => getPopMarkers(this)),
  })
  extendObservable(this.map.tpop, {
    visible: false,
    highlightedIds: [],
    highlightedPopIds: [],
    tpops: computed(() => getTpopsForMap(this)),
    bounds: computed(() => getTpopBounds(this)),
    // alternative is using names
    labelUsingNr: true,
    markers: computed(() => getTpopMarkers(this)),
    idOfTpopBeingLocalized: 0,
  })
  extendObservable(this.map.beob, {
    visible: false,
    highlightedIds: [],
    beobs: computed(() => getBeobForMap(this)),
    markersClustered: computed(() => getBeobMarkersClustered(this)),
    beobsNichtBeurteilt: computed(() =>
      getBeobForMap(this).filter(b => !b.beobzuordnung)
    ),
    beobsNichtZuzuordnen: computed(() =>
      getBeobForMap(this).filter(b => b.NichtZuzuordnen === 1)
    ),
    idOfBeobBeingAssigned: 0,
  })
  this.table = TableStore
  extendObservable(this.table.filteredAndSorted, {
    projekt: computed(() => filteredAndSortedProjekt(this)),
    apberuebersicht: computed(() => filteredAndSortedApberuebersicht(this)),
    ap: computed(() => filteredAndSortedAp(this)),
    assozart: computed(() => filteredAndSortedAssozart(this)),
    idealbiotop: computed(() => filteredAndSortedIdealbiotop(this)),
    beobNichtZuzuordnen: computed(() => filteredAndSortedBeobNichtZuzuordnen(this)),
    beobzuordnung: computed(() => filteredAndSortedBeobzuordnung(this)),
    ber: computed(() => filteredAndSortedBer(this)),
    apber: computed(() => filteredAndSortedApber(this)),
    erfkrit: computed(() => filteredAndSortedErfkrit(this)),
    zieljahr: computed(() => filteredAndSortedZieljahr(this)),
    ziel: computed(() => filteredAndSortedZiel(this)),
    zielber: computed(() => filteredAndSortedZielber(this)),
    pop: computed(() => filteredAndSortedPop(this)),
    popmassnber: computed(() => filteredAndSortedPopmassnber(this)),
    popber: computed(() => filteredAndSortedPopber(this)),
    tpop: computed(() => filteredAndSortedTpop(this)),
    tpopbeob: computed(() => filteredAndSortedTpopbeob(this)),
    tpopber: computed(() => filteredAndSortedTopber(this)),
    tpopfreiwkontr: computed(() => filteredAndSortedTpopfreiwkontr(this)),
    tpopfreiwkontrzaehl: computed(() => filteredAndSortedTpopfreiwkontrzaehl(this)),
    tpopfeldkontr: computed(() => filteredAndSortedTpopfeldkontr(this)),
    tpopfeldkontrzaehl: computed(() => filteredAndSortedTpopfeldkontrzaehl(this)),
    tpopmassnber: computed(() => filteredAndSortedTpopmassnber(this)),
    tpopmassn: computed(() => filteredAndSortedTpopmassn(this)),
  })
  this.valuesForWhichTableDataWasFetched = {}
  this.qk = observable.map()
  extendObservable(this, {
    datasetToDelete: {},
    tellUserReadOnly: action(() =>
      this.listError(new Error(`Sie haben keine Schreibrechte`))
    ),
    setIdOfTpopBeingLocalized: action((id) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      this.map.tpop.idOfTpopBeingLocalized = id
    }),
    localizeTpop: action((x, y) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      localizeTpop(this, x, y)
    }),
    fetchLogin: action((name, password) => fetchLogin(this, name, password)),
    logout: action(() => logout(this)),
    setLoginFromIdb: action(() => setLoginFromIdb(this)),
    setMapMouseCoord: action((e) => {
      this.map.mouseCoord = [e.latlng.lng, e.latlng.lat]
    }),
    toggleMapPopLabelContent: action((layer) =>
      this.map[layer].labelUsingNr = !this.map[layer].labelUsingNr
    ),
    toggleApFilter: action(() => {
      this.node.apFilter = !this.node.apFilter
    }),
    fetchQk: action(() => fetchQk({ store: this })),
    setQk: action(({ berichtjahr, messages, filter }) =>
      setQk({ store: this, berichtjahr, messages, filter })
    ),
    setQkFilter: action(({ filter }) =>
      setQkFilter({ store: this, filter })
    ),
    addMessagesToQk: action(({ messages }) => {
      addMessagesToQk({ store: this, messages })
    }),
    fetchFieldsFromIdb: action(() => fetchFieldsFromIdb(this)),
    updateLabelFilter: action((table, value) => {
      if (!table) {
        return this.listError(
          new Error(`nodeLabelFilter cant be updated: no table passed`)
        )
      }
      this.node.nodeLabelFilter.set(table, value)
    }),
    insertBeobzuordnung: action((newKey, newValue) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      insertBeobzuordnung(this, newKey, newValue)
    }),
    insertDataset: action((table, parentId, baseUrl) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      insertDataset(this, table, parentId, baseUrl)
    }),
    deleteDatasetDemand: action((table, id, url, label) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      deleteDatasetDemand(this, table, id, url, label)
    }),
    deleteDatasetAbort: action(() => {
      this.datasetToDelete = {}
    }),
    deleteDatasetExecute: action(() => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      deleteDatasetExecute(this)
    }),
    deleteBeobzuordnung: action((beobId) => deleteBeobzuordnung(this, beobId)),
    listError: action(error =>
      listError(this, error)
    ),
    // updates data in store
    updateProperty: action((key, value) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      updateProperty(this, key, value)
    }),
    // updates data in database
    updatePropertyInDb: action((key, value) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      updatePropertyInDb(this, key, value)
    }),
    // fetch all data of a table
    // primarily used for werte (domain) tables
    // and projekt
    fetchTable: action((schemaName, tableName) =>
      fetchTable(this, schemaName, tableName)
    ),
    fetchStammdaten: action(() => {
      fetchFields(this)
      fetchStammdatenTables(this)
    }),
    fetchBeobzuordnung: action(apArtId =>
      fetchBeobzuordnungModule(this, apArtId)
    ),
    // fetch data of table for id of parent table
    // used for actual apflora data (but projekt)
    fetchTableByParentId: action((schemaName, tableName, parentId) =>
      fetchTableByParentId(this, schemaName, tableName, parentId)
    ),
    fetchTpopForAp: action(apArtId =>
      fetchTpopForAp(this, apArtId)
    ),
    fetchPopForAp: action(apArtId =>
      fetchPopForAp(this, apArtId)
    ),
    fetchDatasetById: action(({ schemaName, tableName, id }) =>
      fetchDatasetById({ store: this, schemaName, tableName, id })
    ),
    fetchBeobBereitgestellt: action(apArtId =>
      fetchBeobBereitgestellt(this, apArtId)
    ),
    fetchBeobEvab: action(apArtId =>
      fetchBeobEvab(this, apArtId)
    ),
    fetchBeobInfospezies: action(apArtId =>
      fetchBeobInfospezies(this, apArtId)
    ),
    // action when user clicks on a node in the tree
    toggleNode: action(node =>
      toggleNode(this, node)
    ),
    /**
     * urlQueries are used to control tabs
     * for instance: Entwicklung or Biotop in tpopfeldkontr
     * or: strukturbaum, daten and map in projekte
     */
    setUrlQuery: action((key, value) =>
      setUrlQuery(this, key, value)
    ),
    showMapLayer: action((layer, bool) =>
      this.map[layer].visible = bool
    ),
    highlightIdOnMap: action((layer, id) =>
      this.map[layer].highlightedIds = [...this.map[layer].highlightedIds, parseInt(id, 10)]
    ),
    unhighlightIdOnMap: action((layer, id) =>
      this.map[layer].highlightedIds = this.map[layer].highlightedIds.filter(i => i !== id)
    ),
    highlightTpopByPopIdOnMap: action((id) =>
      this.map.tpop.highlightedPopIds = [...this.map.tpop.highlightedPopIds, parseInt(id, 10)]
    ),
    unhighlightTpopByPopIdOnMap: action((id) =>
      this.map.tpop.highlightedPopIds = this.map.tpop.highlightedPopIds.filter(i => i !== id)
    ),
    /**
     * url paths are used to control tree and forms
     */
    url: computed(() =>
      //$FlowIssue
      getUrl(this.history.location.pathname)
    ),
    /**
     * urlQueries are used to control tabs
     * for instance: Entwicklung or Biotop in tpopfeldkontr
     */
    urlQuery: computed(() =>
      //$FlowIssue
      getUrlQuery(this.history.location.search)
    ),
    projektNodes: computed(() =>
      buildProjektNodes(this)
    ),
    activeDataset: computed(() =>
      updateActiveDatasetFromUrl(this)
    ),
    activeUrlElements: computed(() =>
      getActiveUrlElements(this.url)
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
        fetchDataForActiveUrlElements(MyStore)
      }
    ),
  }
)

export default MyStore
