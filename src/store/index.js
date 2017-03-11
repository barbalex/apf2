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
import queryString from 'query-string'
import axios from 'axios'

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
import filteredAndSortedTpopmassn from './table/filteredAndSorted/tpopmassn'

import TableStore from './table'
import ObservableHistory from './ObservableHistory'
import apiBaseUrl from '../modules/apiBaseUrl'
import deleteDatasetInIdb from '../modules/deleteDatasetInIdb'

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
    projekt: computed(() => filteredAndSortedProjekt(this)),
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
        const beobBereitgestellt = this.table.beob_bereitgestellt.get(el.NO_NOTE)
        if (beobBereitgestellt) {
          if (beobBereitgestellt.Datum) {
            datum = beobBereitgestellt.Datum
          }
          if (beobBereitgestellt.Autor) {
            autor = beobBereitgestellt.Autor
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
    popmassnber: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab popmassnber as array and sort them by year
      let popmassnber = Array.from(table.popmassnber.values())
      // show only nodes of active pop
      popmassnber = popmassnber.filter(a => a.PopId === activeUrlElements.pop)
      // get erfkritWerte
      const tpopmassnErfbeurtWerte = Array.from(table.tpopmassn_erfbeurt_werte.values())
      // map through all projekt and create array of nodes
      popmassnber.forEach((el) => {
        const tpopmassnErfbeurtWert = tpopmassnErfbeurtWerte.find(e => e.BeurteilId === el.PopMassnBerErfolgsbeurteilung)
        const beurteilTxt = tpopmassnErfbeurtWert ? tpopmassnErfbeurtWert.BeurteilTxt : null
        el.label = `${el.PopMassnBerJahr || `(kein Jahr)`}: ${beurteilTxt || `(nicht beurteilt)`}`
      })
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`popmassnber`)
      if (filterString) {
        popmassnber = popmassnber.filter(p =>
          p.label.toLowerCase().includes(filterString.toLowerCase())
        )
      }
      // sort by label and return
      return sortBy(popmassnber, `label`)
    }),
    popber: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab popber as array and sort them by year
      let popber = Array.from(table.popber.values())
      // show only nodes of active pop
      popber = popber.filter(a => a.PopId === activeUrlElements.pop)
      // get erfkritWerte
      const popEntwicklungWerte = Array.from(table.pop_entwicklung_werte.values())
      // map through all projekt and create array of nodes
      popber.forEach((el) => {
        const popEntwicklungWert = popEntwicklungWerte.find(e => e.EntwicklungId === el.PopBerEntwicklung)
        const entwicklungTxt = popEntwicklungWert ? popEntwicklungWert.EntwicklungTxt : null
        el.label = `${el.PopBerJahr || `(kein Jahr)`}: ${entwicklungTxt || `(nicht beurteilt)`}`
      })
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`popber`)
      if (filterString) {
        popber = popber.filter(p =>
          p.label.toLowerCase().includes(filterString.toLowerCase())
        )
      }
      // sort by label and return
      return sortBy(popber, `label`)
    }),
    tpop: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab tpop as array and sort them by year
      let tpop = Array.from(table.tpop.values())
      // show only nodes of active pop
      tpop = tpop.filter(a => a.PopId === activeUrlElements.pop)
      tpop = sortBy(tpop, `TPopNr`)
      // map through all projekt and create array of nodes
      tpop.forEach((el) => {
        el.label = `${el.TPopNr || `(keine Nr)`}: ${el.TPopFlurname || `(kein Flurname)`}`
      })
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`tpop`)
      if (filterString) {
        tpop = tpop.filter(p =>
          p.label.toLowerCase().includes(filterString.toLowerCase())
        )
      }
      return tpop
    }),
    tpopbeob: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab tpopbeob as array and sort them by year
      let tpopbeob = Array
        .from(table.beobzuordnung.values())
        .filter(b => b.TPopId === activeUrlElements.tpop)
      // map through all and create array of nodes
      tpopbeob.forEach((el) => {
        let datum = ``
        let autor = ``
        const beob = this.table.beob_bereitgestellt.get(el.beobId)
        if (beob) {
          if (beob.Datum) {
            datum = beob.Datum
          }
          if (beob.Autor) {
            autor = beob.Autor
          }
        }
        const quelle = table.beob_quelle.get(el.QuelleId)
        const quelleName = quelle && quelle.name ? quelle.name : ``
        el.label = `${datum || `(kein Datum)`}: ${autor || `(kein Autor)`} (${quelleName})`
        el.beobId = isNaN(el.NO_NOTE) ? el.NO_NOTE : parseInt(el.NO_NOTE, 10)
      })
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`tpopbeob`)
      if (filterString) {
        tpopbeob = tpopbeob.filter(p =>
          p.label.toLowerCase().includes(filterString.toLowerCase())
        )
      }
      // sort by label and return
      return sortBy(tpopbeob, `label`).reverse()
    }),
    tpopber: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab tpopber as array and sort them by year
      let tpopber = Array.from(table.tpopber.values())
      // show only nodes of active ap
      tpopber = tpopber.filter(a => a.TPopId === activeUrlElements.tpop)
      // get entwicklungWerte
      const tpopEntwicklungWerte = Array.from(table.tpop_entwicklung_werte.values())
      // map through all projekt and create array of nodes
      tpopber.forEach((el) => {
        const tpopEntwicklungWert = tpopEntwicklungWerte.find(e => e.EntwicklungCode === el.TPopBerEntwicklung)
        const entwicklungTxt = tpopEntwicklungWert ? tpopEntwicklungWert.EntwicklungTxt : null
        el.label = `${el.TPopBerJahr || `(kein Jahr)`}: ${entwicklungTxt || `(nicht beurteilt)`}`
      })
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`tpopber`)
      if (filterString) {
        tpopber = tpopber.filter(p =>
          p.label.toLowerCase().includes(filterString.toLowerCase())
        )
      }
      // sort by label and return
      return sortBy(tpopber, `label`)
    }),
    tpopfreiwkontr: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab tpopkontr as array and sort them by year
      let tpopkontr = Array.from(table.tpopkontr.values())
        .filter(t => t.TPopKontrTyp === `Freiwilligen-Erfolgskontrolle`)
      // show only nodes of active ap
      tpopkontr = tpopkontr.filter(a => a.TPopId === activeUrlElements.tpop)
      // add label
      tpopkontr.forEach((el) => {
        el.label = `${el.TPopKontrJahr || `(kein Jahr)`}`
      })
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`tpopfreiwkontr`)
      if (filterString) {
        tpopkontr = tpopkontr.filter(p =>
          p.label.toLowerCase().includes(filterString.toLowerCase())
        )
      }
      // sort by label and return
      return sortBy(tpopkontr, `label`)
    }),
    tpopfreiwkontrzaehl: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab tpopkontrzaehl as array
      let tpopkontrzaehl = Array.from(table.tpopkontrzaehl.values())
      // show only nodes of active tpopkontr
      tpopkontrzaehl = tpopkontrzaehl.filter(a => a.TPopKontrId === activeUrlElements.tpopfreiwkontr)

      // get zaehleinheitWerte
      const zaehleinheitWerte = Array.from(table.tpopkontrzaehl_einheit_werte.values())
      const methodeWerte = Array.from(table.tpopkontrzaehl_methode_werte.values())

      tpopkontrzaehl.forEach((el) => {
        const zaehleinheitWert = zaehleinheitWerte.find(e => e.ZaehleinheitCode === el.Zaehleinheit)
        const zaehleinheitTxt = zaehleinheitWert ? zaehleinheitWert.ZaehleinheitTxt : null
        const methodeWert = methodeWerte.find(e => e.BeurteilCode === el.Methode)
        const methodeTxt = methodeWert ? methodeWert.BeurteilTxt : null
        el.label = `${el.Anzahl || `(keine Anzahl)`} ${zaehleinheitTxt || `(keine Einheit)`} (${methodeTxt || `keine Methode`})`
      })
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`tpopkontrzaehl`)
      if (filterString) {
        tpopkontrzaehl = tpopkontrzaehl.filter(p =>
          p.label.toLowerCase().includes(filterString.toLowerCase())
        )
      }
      // sort by label and return
      return sortBy(tpopkontrzaehl, `label`)
    }),
    tpopfeldkontr: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab tpopkontr as array and sort them by year
      let tpopkontr = Array.from(table.tpopkontr.values())
        .filter(t => t.TPopKontrTyp !== `Freiwilligen-Erfolgskontrolle`)
      // show only nodes of active ap
      tpopkontr = tpopkontr.filter(a => a.TPopId === activeUrlElements.tpop)
      // map through all projekt and create array of nodes
      tpopkontr.forEach((el) => {
        el.label = `${el.TPopKontrJahr || `(kein Jahr)`}: ${el.TPopKontrTyp || `(kein Typ)`}`
      })
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`tpopfeldkontr`)
      if (filterString) {
        tpopkontr = tpopkontr.filter(p =>
          p.label.toLowerCase().includes(filterString.toLowerCase())
        )
      }
      // sort by label and return
      return sortBy(tpopkontr, `label`)
    }),
    tpopfeldkontrzaehl: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab tpopkontrzaehl as array
      let tpopkontrzaehl = Array.from(table.tpopkontrzaehl.values())
      // show only nodes of active tpopkontr
      tpopkontrzaehl = tpopkontrzaehl.filter(a => a.TPopKontrId === activeUrlElements.tpopfeldkontr)

      // get zaehleinheitWerte
      const zaehleinheitWerte = Array.from(table.tpopkontrzaehl_einheit_werte.values())
      const methodeWerte = Array.from(table.tpopkontrzaehl_methode_werte.values())

      tpopkontrzaehl.forEach((el) => {
        const zaehleinheitWert = zaehleinheitWerte.find(e => e.ZaehleinheitCode === el.Zaehleinheit)
        const zaehleinheitTxt = zaehleinheitWert ? zaehleinheitWert.ZaehleinheitTxt : null
        const methodeWert = methodeWerte.find(e => e.BeurteilCode === el.Methode)
        const methodeTxt = methodeWert ? methodeWert.BeurteilTxt : null
        el.label = `${el.Anzahl || `(keine Anzahl)`} ${zaehleinheitTxt || `(keine Einheit)`} (${methodeTxt || `keine Methode`})`
      })
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`tpopkontrzaehl`)
      if (filterString) {
        tpopkontrzaehl = tpopkontrzaehl.filter(p =>
          p.label.toLowerCase().includes(filterString.toLowerCase())
        )
      }
      // sort by label and return
      return sortBy(tpopkontrzaehl, `label`)
    }),
    tpopmassnber: computed(() => {
      const { activeUrlElements, table, node } = this
      // grab tpopmassnber as array and sort them by year
      let tpopmassnber = Array.from(table.tpopmassnber.values())
      // show only nodes of active ap
      tpopmassnber = tpopmassnber.filter(a => a.TPopId === activeUrlElements.tpop)
      // get erfkritWerte
      const tpopmassnErfbeurtWerte = Array.from(table.tpopmassn_erfbeurt_werte.values())
      // map through all projekt and create array of nodes
      tpopmassnber.forEach((el) => {
        const tpopmassnErfbeurtWert = tpopmassnErfbeurtWerte.find(e => e.BeurteilId === el.TPopMassnBerErfolgsbeurteilung)
        const beurteilTxt = tpopmassnErfbeurtWert ? tpopmassnErfbeurtWert.BeurteilTxt : null
        el.label = `${el.TPopMassnBerJahr || `(kein Jahr)`}: ${beurteilTxt || `(nicht beurteilt)`}`
      })
      // filter by node.nodeLabelFilter
      const filterString = node.nodeLabelFilter.get(`tpopmassnber`)
      if (filterString) {
        tpopmassnber = tpopmassnber.filter(p =>
          p.label.toLowerCase().includes(filterString.toLowerCase())
        )
      }
      // sort by label and return
      return sortBy(tpopmassnber, `label`)
    }),
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
    deleteBeobzuordnung: action((beobId) => {
      const { activeUrlElements, urlQuery, history, table } = this
      // delete beobzuordnung
      const deleteUrl = `${apiBaseUrl}/apflora/tabelle=beobzuordnung/tabelleIdFeld=NO_NOTE/tabelleId=${beobId}`
      axios.delete(deleteUrl)
        .then(() => {
          // remove this dataset in store.table
          table.beobzuordnung.delete(beobId)
          // remove from idb
          deleteDatasetInIdb(this, `beobzuordnung`, beobId)
          // set url to corresponding beob_bereitgestellt
          const query = `${Object.keys(urlQuery).length > 0 ? `?${queryString.stringify(urlQuery)}` : ``}`
          const newUrl = `/Projekte/${activeUrlElements.projekt}/Arten/${activeUrlElements.ap}/nicht-beurteilte-Beobachtungen/${beobId}${query}`
          history.push(newUrl)
        })
        .catch((error) =>
          this.listError(error)
        )
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
