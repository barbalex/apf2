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
import uniq from 'lodash/uniq'

import fetchTable from '../modules/fetchTable'
import fetchBeobzuordnungModule from '../modules/fetchBeobzuordnung'
import fetchTableByParentId from '../modules/fetchTableByParentId'
import fetchTpopForAp from '../modules/fetchTpopForAp'
import fetchPopForAp from '../modules/fetchPopForAp'
import fetchDatasetById from '../modules/fetchDatasetById'
import fetchBeobBereitgestellt from '../modules/fetchBeobBereitgestellt'
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
import getPopBounds from '../modules/getPopBounds'
import getTpopBounds from '../modules/getTpopBounds'
import epsg4326to21781 from '../modules/epsg4326to21781'
import getPopMarkers from '../modules/getPopMarkers'
import getTpopMarkers from '../modules/getTpopMarkers'
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
    map: null,
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
  }
  extendObservable(this.map, {
    mouseCoord: [],
    mouseCoordEpsg21781: computed(() => {
      if (this.map.mouseCoord[0]) {
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
    pops: computed(() =>
      getPopsForMap(this)
    ),
    bounds: computed(() =>
      getPopBounds(this.map.pop.pops)
    ),
    // alternative is using names
    labelUsingNr: true,
    markers: computed(() =>
      getPopMarkers(this)
    ),
  })
  extendObservable(this.map.tpop, {
    visible: false,
    highlightedIds: [],
    highlightedPopIds: [],
    tpops: computed(() =>
      getTpopsForMap(this)
    ),
    bounds: computed(() =>
      getTpopBounds(this.map.tpop.tpops)
    ),
    // alternative is using names
    labelUsingNr: true,
    markers: computed(() =>
      getTpopMarkers(this)
    ),
    idOfTpopBeingLocalized: 0,
  })
  this.table = TableStore
  extendObservable(this.table.filteredAndSorted, {
    projekt: computed(() => {
      // grab projekte as array and sort them by name
      let projekte = Array.from(this.table.projekt.values())
      // filter by node.nodeLabelFilter
      const filterString = this.node.nodeLabelFilter.get(`projekt`)
      if (filterString) {
        projekte = projekte.filter(p =>
          p.ProjName
            .toLowerCase()
            .includes(filterString.toLowerCase())
        )
      }
      // sort
      projekte = sortBy(projekte, `ProjName`)
      return projekte
    }),
    apberuebersicht: computed(() => {
      const { activeUrlElements } = this
      // grab apberuebersicht as array and sort them by year
      let apberuebersicht = Array.from(this.table.apberuebersicht.values())
      // show only nodes of active projekt
      apberuebersicht = apberuebersicht.filter(a => a.ProjId === activeUrlElements.projekt)
      // filter by node.nodeLabelFilter
      const filterString = this.node.nodeLabelFilter.get(`apberuebersicht`)
      if (filterString) {
        apberuebersicht = apberuebersicht.filter(p =>
          p.JbuJahr
            .toString()
            .includes(filterString)
        )
      }
      // sort
      apberuebersicht = sortBy(apberuebersicht, `JbuJahr`)
      return apberuebersicht
    }),
    ap: computed(() => {
      const { activeUrlElements, table } = this
      const { adb_eigenschaften } = table
      // grab ap as array and sort them by name
      let ap = Array.from(this.table.ap.values())
      // show only ap of active projekt
      ap = ap.filter(a => a.ProjId === activeUrlElements.projekt)
      // filter by node.apFilter
      if (this.node.apFilter) {
        // ApStatus between 3 and 5
        ap = ap.filter(a => [1, 2, 3].includes(a.ApStatus))
      }
      // sort
      // need to add artnameVollständig to sort and filter by nodeLabelFilter
      if (adb_eigenschaften.size > 0) {
        ap.forEach(x => {
          const ae = adb_eigenschaften.get(x.ApArtId)
          return x.label = ae ? ae.Artname : `(keine Art gewählt)`
        })
        // filter by node.nodeLabelFilter
        const filterString = this.node.nodeLabelFilter.get(`ap`)
        if (filterString) {
          ap = ap.filter(p =>
            p.label.toLowerCase().includes(filterString.toLowerCase())
          )
        }
        ap = sortBy(ap, `label`)
      }
      return ap
    }),
    assozart: computed(() => {
      const { activeUrlElements, table } = this
      const { adb_eigenschaften } = table
      // grab assozart as array and sort them by year
      let assozart = Array.from(this.table.assozart.values())
      // show only nodes of active ap
      assozart = assozart.filter(a => a.AaApArtId === activeUrlElements.ap)
      // sort
      // need to add artnameVollständig to sort and filter by nodeLabelFilter
      if (adb_eigenschaften.size > 0) {
        assozart.forEach(x => {
          const ae = adb_eigenschaften.get(x.AaSisfNr)
          return x.label = ae ? ae.Artname : `(keine Art gewählt)`
        })
        // filter by node.nodeLabelFilter
        const filterString = this.node.nodeLabelFilter.get(`assozart`)
        if (filterString) {
          assozart = assozart.filter(p =>
            p.label.toLowerCase().includes(filterString.toLowerCase())
          )
        }
        // sort by label
        assozart = sortBy(assozart, `label`)
      }
      return assozart
    }),
    idealbiotop: computed(() => {
      const { activeUrlElements } = this
      // grab assozart as array and sort them by year
      let idealbiotop = Array.from(this.table.idealbiotop.values())
      // show only nodes of active ap
      idealbiotop = idealbiotop.filter(a => a.IbApArtId === activeUrlElements.ap)
      return idealbiotop
    }),
    beobNichtZuzuordnen: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab beobNichtZuzuordnen as array and sort them by year
      let beobNichtZuzuordnen = Array
        .from(table.beobzuordnung.values())
        .filter(b => b.BeobNichtZuordnen === 1)
        // show only nodes of active ap
        .filter(a => (
          a.beobBereitgestellt &&
          a.beobBereitgestellt.NO_ISFS &&
          a.beobBereitgestellt.NO_ISFS === activeUrlElements.ap
        ))
      // add label
      beobNichtZuzuordnen.forEach((el) => {
        let datum = ``
        let autor = ``
        if (el.beobBereitgestellt) {
          if (el.beobBereitgestellt.Datum) {
            datum = el.beobBereitgestellt.Datum
          }
          if (el.beobBereitgestellt.Autor) {
            autor = el.beobBereitgestellt.Autor
          }
        }
        const quelle = table.beob_quelle.get(el.QuelleId)
        const quelleName = quelle && quelle.name ? quelle.name : ``
        el.label  = `${datum || `(kein Datum)`}: ${autor || `(kein Autor)`} (${quelleName})`
      })
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`beobNichtZuzuordnen`)
      if (filterString) {
        beobNichtZuzuordnen = beobNichtZuzuordnen.filter(p =>
          p.label.toLowerCase().includes(filterString.toLowerCase())
        )
      }
      // sort by label
      beobNichtZuzuordnen = sortBy(beobNichtZuzuordnen, `label`).reverse()
      return beobNichtZuzuordnen
    }),
    beobzuordnung: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab beob_bereitgestellt as array and sort them by year
      let beobzuordnung = Array.from(table.beob_bereitgestellt.values())
      // show only nodes of active ap
      beobzuordnung = beobzuordnung.filter(a =>
        a.NO_ISFS === activeUrlElements.ap &&
        (
          (a.beobzuordnung &&
          a.beobzuordnung.type &&
          a.beobzuordnung.type === `nichtBeurteilt`) ||
          !a.beobzuordnung
        )
      )
      beobzuordnung.forEach((el) => {
        const quelle = table.beob_quelle.get(el.QuelleId)
        const quelleName = quelle && quelle.name ? quelle.name : ``
        el.label = `${el.Datum || `(kein Datum)`}: ${el.Autor || `(kein Autor)`} (${quelleName})`
      })
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`beobzuordnung`)
      if (filterString) {
        beobzuordnung = beobzuordnung.filter(p =>
          p.label.toLowerCase().includes(filterString.toLowerCase())
        )
      }
      // sort by label and return
      return sortBy(beobzuordnung, `label`).reverse()
    }),
    ber: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab ber as array and sort them by year
      let ber = Array.from(table.ber.values())
      // show only nodes of active ap
      ber = ber.filter(a => a.ApArtId === activeUrlElements.ap)
      // add label
      ber.forEach((el) => {
        el.label = `${el.BerJahr || `(kein Jahr)`}: ${el.BerTitel || `(kein Titel)`}`
      })
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`ber`)
      if (filterString) {
        ber = ber.filter((p) => {
          return p.label.toLowerCase().includes(filterString)
        })
      }
      // sort
      ber = sortBy(ber, `label`)
      return ber
    }),
    apber: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab apber as array and sort them by year
      let apber = Array.from(table.apber.values())
      // show only nodes of active ap
      apber = apber.filter(a => a.ApArtId === activeUrlElements.ap)
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`apber`)
      if (filterString) {
        apber = apber.filter((p) => {
          if (p.JBerJahr !== undefined && p.JBerJahr !== null) {
            return p.JBerJahr.toString().includes(filterString)
          }
          return false
        })
      }
      // add label
      apber.forEach((el) => {
        el.label = el.JBerJahr || `(kein Jahr)`
      })
      // sort
      apber = sortBy(apber, `JBerJahr`)
      return apber
    }),
    erfkrit: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab erfkrit as array and sort them by year
      let erfkrit = Array.from(table.erfkrit.values())
      // show only nodes of active ap
      erfkrit = erfkrit.filter(a => a.ApArtId === activeUrlElements.ap)
      // get erfkritWerte
      const apErfkritWerte = Array.from(table.ap_erfkrit_werte.values())
      erfkrit.forEach((el, index) => {
        const erfkritWert = apErfkritWerte.find(e => e.BeurteilId === el.ErfkritErreichungsgrad)
        const beurteilTxt = erfkritWert ? erfkritWert.BeurteilTxt : null
        el.sort = erfkritWert ? erfkritWert.BeurteilOrd : null
        el.label = `${beurteilTxt || `(nicht beurteilt)`}: ${el.ErfkritTxt || `(keine Kriterien erfasst)`}`
      })
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`erfkrit`)
      if (filterString) {
        erfkrit = erfkrit.filter(p =>
          p.label.toLowerCase().includes(filterString.toLowerCase())
        )
      }
      // sort by label and return
      erfkrit = sortBy(erfkrit, `sort`)
      return erfkrit
    }),
    zieljahr: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab ziele as array
      let ziele = Array.from(table.ziel.values())
      // show only nodes of active ap
      ziele = ziele.filter(a => a.ApArtId === activeUrlElements.ap)
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`ziel`)
      const zieltypWerte = Array.from(table.ziel_typ_werte.values())
      if (filterString) {
        ziele = ziele.filter((p) => {
          const zielWert = zieltypWerte.find(e => e.ZieltypId === p.ZielTyp)
          const zieltypTxt = zielWert ? zielWert.ZieltypTxt : `kein Zieltyp`
          const label = `${p.ZielBezeichnung || `(kein Ziel)`} (${zieltypTxt})`
          return label.toLowerCase().includes(filterString.toLowerCase())
        })
      }
      if (ziele.length > 0) {
        const zielJahrWerte = uniq(ziele.map(z => z.ZielJahr)).sort()
        const zielJahreObjects = zielJahrWerte.map(z => ({
          jahr: z,
          length: ziele.filter(zj => zj.ZielJahr === z).length
        }))
        return zielJahreObjects
      }
      return []
    }),
    ziel: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab ziele as array
      let ziele = Array.from(table.ziel.values())
      // show only nodes of active ap
      const activeAp = activeUrlElements.ap
      ziele = ziele.filter(a => a.ApArtId === activeAp)
      // show only nodes of active zieljahr
      const jahr = activeUrlElements.zieljahr
      ziele = ziele.filter((a) => {
        if (jahr === null || jahr === undefined) {
          return a.ZielJahr !== 0 && !a.ZielJahr
        }
        return a.ZielJahr === jahr
      })
      // get zielWerte
      const zieltypWerte = Array.from(table.ziel_typ_werte.values())
      // map through all and create array of nodes
      ziele.forEach((el) => {
        const zielWert = zieltypWerte.find(e => e.ZieltypId === el.ZielTyp)
        const zieltypTxt = zielWert ? zielWert.ZieltypTxt : `kein Zieltyp`
        el.label = `${el.ZielBezeichnung || `(kein Ziel)`} (${zieltypTxt})`
      })
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`ziel`)
      if (filterString) {
        ziele = ziele.filter(p =>
          p.label.toLowerCase().includes(filterString.toLowerCase())
        )
      }
      // sort by label and return
      return sortBy(ziele, `label`)
    }),
    zielber: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab zielbere as array and sort them by year
      let zielbere = Array.from(table.zielber.values())
      zielbere = zielbere.filter(a => a.ZielId === activeUrlElements.ziel)
      // map through all and create array of nodes
      zielbere.forEach((el) => {
        el.label = `${el.ZielBerJahr || `(kein Jahr)`}: ${el.ZielBerErreichung || `(keine Entwicklung)`}`
      })
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`zielber`)
      if (filterString) {
        zielbere = zielbere.filter(p =>
          p.label.toLowerCase().includes(filterString.toLowerCase())
        )
      }
      // sort by label and return
      return sortBy(zielbere, `label`)
    }),
    pop: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab pop as array and sort them by year
      let pop = Array.from(table.pop.values())
      // show only nodes of active ap
      pop = pop.filter(a => a.ApArtId === activeUrlElements.ap)
      pop = sortBy(pop, `PopNr`)
      // map through all projekt and create array of nodes
      pop.forEach((el) => {
        el.label = `${el.PopNr || `(keine Nr)`}: ${el.PopName || `(kein Name)`}`
      })
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`pop`)
      if (filterString) {
        pop = pop.filter(p =>
          p.label.toLowerCase().includes(filterString.toLowerCase())
        )
      }
      return pop
    }),
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
    fetchLogin: action((name, password) => {
      fetchLogin(this, name, password)
    }),
    logout: action(() =>
      logout(this)
    ),
    setLoginFromIdb: action(() =>
      setLoginFromIdb(this)
    ),
    setMapMouseCoord: action((e) => {
      this.map.mouseCoord = [e.latlng.lng, e.latlng.lat]
    }),
    toggleMapPopLabelContent: action((layer) =>
      this.map[layer].labelUsingNr = !this.map[layer].labelUsingNr
    ),
    toggleApFilter: action(() => {
      this.node.apFilter = !this.node.apFilter
    }),
    fetchQk: action(() =>
      fetchQk({ store: this })
    ),
    setQk: action(({ berichtjahr, messages, filter }) =>
      setQk({ store: this, berichtjahr, messages, filter })
    ),
    setQkFilter: action(({ filter }) =>
      setQkFilter({ store: this, filter })
    ),
    addMessagesToQk: action(({ messages }) => {
      addMessagesToQk({ store: this, messages })
    }),
    fetchFieldsFromIdb: action(() =>
      fetchFieldsFromIdb(this)
    ),
    updateLabelFilter: action((table, value) => {
      if (!table) {
        return this.listError(
          new Error(`nodeLabelFilter cant be updated: no table passed`)
        )
      }
      this.node.nodeLabelFilter.set(table, value)
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
