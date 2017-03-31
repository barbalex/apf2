// @flow
import {
  extendObservable,
  action,
  autorun,
  autorunAsync,
  computed,
  observable,
} from 'mobx'

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
import fetchStammdatenTables from '../modules/fetchStammdatenTables'
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
import writeToStore from '../modules/writeToStore'

import TableStore from './table'
import ObservableHistory from './ObservableHistory'
import extendNode from './extendNode'
import extendDropdownList from './extendDropdownList'
import extendApp from './extendApp'
import extendUi from './extendUi'
import extendUser from './extendUser'
import extendMap from './extendMap'

function Store() {
  this.history = ObservableHistory
  this.loading = []
  extendObservable(this, {
    loading: [],
  })
  this.activeUrlElements = {}
  this.urlQuery = {}
  this.node = {
    apFilter: false,
    toggleApFilter: null,
    nodeLabelFilter: {},
    applyNodeLabelFilterToExport: false,
    toggleApplyNodeLabelFilterToExport: null,
    activeNodeFilter: {},
    applyActiveNodeFilterToExport: false,
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
    applyMapFilterToExport: false,
    applyMapFilterToTree: false,
    node: {
      nodes: [],
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
  this.ui = {}
  this.app = {}
  this.user = {}
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

extendNode(MyStore)
extendDropdownList(MyStore)
extendApp(MyStore)
extendUi(MyStore)
extendUser(MyStore)
extendMap(MyStore)

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
