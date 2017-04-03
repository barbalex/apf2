// @flow
/**
 * Problem: Same data is refetched very often
 * Idea 1: Compare activeNodes with previous activeNodes
 * and only fetch what is new
 */

import { runInAction } from 'mobx'
import forEach from 'lodash/forEach'

const fetchDataForActiveNodes = (
  store:Object,
  showPop:boolean,
  showTpop:boolean,
  showTpopBeob:boolean,
  showBeobNichtBeurteilt:boolean,
  showBeobNichtZuzuordnen:boolean
) => {
  const { activeNodes } = store.tree
  const fetchingFromActiveElements = {
    exporte() {
      store.fetchTableByParentId(`apflora`, `ap`, activeNodes.projekt)
      store.fetchTable(`beob`, `adb_eigenschaften`)
    },
    projektFolder() {
      store.fetchTable(`apflora`, `projekt`)
    },
    projekt() {
      store.fetchTableByParentId(`apflora`, `ap`, activeNodes.projekt)
      store.fetchTableByParentId(`apflora`, `apberuebersicht`, activeNodes.projekt)
    },
    apberuebersichtFolder() {
      store.fetchTableByParentId(`apflora`, `apberuebersicht`, activeNodes.projekt)
    },
    apFolder() {
      store.fetchTable(`beob`, `adb_eigenschaften`)
    },
    ap() {
      store.fetchTableByParentId(`apflora`, `pop`, activeNodes.ap)
      store.fetchTableByParentId(`apflora`, `ziel`, activeNodes.ap)
      store.fetchTableByParentId(`apflora`, `erfkrit`, activeNodes.ap)
      store.fetchTableByParentId(`apflora`, `apber`, activeNodes.ap)
      store.fetchTableByParentId(`apflora`, `ber`, activeNodes.ap)
      store.fetchTableByParentId(`apflora`, `assozart`, activeNodes.ap)
      store.fetchTableByParentId(`apflora`, `idealbiotop`, activeNodes.ap)
      store.fetchTable(`apflora`, `adresse`)
      store.fetchTable(`apflora`, `ap_bearbstand_werte`)
      store.fetchTable(`apflora`, `ap_umsetzung_werte`)
      store.fetchBeobBereitgestellt(activeNodes.ap)
      store.fetchBeobzuordnung(activeNodes.ap)
      store.fetchTable(`apflora`, `pop_status_werte`)
      if (showTpop) {
        store.fetchTpopForAp(activeNodes.ap)
        store.fetchPopForAp(activeNodes.ap)
      }
      if (showPop) {
        store.fetchPopForAp(activeNodes.ap)
      }
      if (
        showBeobNichtBeurteilt ||
        showBeobNichtZuzuordnen ||
        showTpopBeob
      ) {
        store.fetchTable(`beob`, `beob_quelle`)
        store.fetchPopForAp(activeNodes.ap)
        store.fetchTpopForAp(activeNodes.ap)
        store.fetchBeobEvab(activeNodes.ap)
        store.fetchBeobInfospezies(activeNodes.ap)
      }
    },
    qk() {
      store.fetchQk()
    },
    assozartFolder() {},
    idealbiotopFolder() {},
    beobNichtZuzuordnenFolder() {
      store.fetchTable(`beob`, `beob_quelle`)
      store.fetchTpopForAp(activeNodes.ap)
      store.fetchBeobEvab(activeNodes.ap)
      store.fetchBeobInfospezies(activeNodes.ap)
    },
    beobNichtZuzuordnen () {
      const id = activeNodes.beobNichtZuzuordnen
      const table = (
        isNaN(id) ?
        `beob_evab` :
        `beob_infospezies`
      )
      store.fetchDatasetById({
        schemaName: `beob`,
        tableName: table,
        id,
      })
    },
    beobzuordnungFolder() {
      store.fetchTable(`beob`, `beob_quelle`)
      store.fetchTpopForAp(activeNodes.ap)
      store.fetchBeobEvab(activeNodes.ap)
      store.fetchBeobInfospezies(activeNodes.ap)
    },
    beobzuordnung() {},
    berFolder() {
      store.fetchTableByParentId(`apflora`, `ber`, activeNodes.ap)
    },
    apberFolder() {
      store.fetchTableByParentId(`apflora`, `apber`, activeNodes.ap)
      store.fetchTable(`apflora`, `ap_erfkrit_werte`)
    },
    erfkritFolder() {
      store.fetchTableByParentId(`apflora`, `erfkrit`, activeNodes.ap)
      store.fetchTable(`apflora`, `ap_erfkrit_werte`)
    },
    zielFolder() {
      store.fetchTableByParentId(`apflora`, `ziel`, activeNodes.ap)
      store.fetchTable(`apflora`, `ziel_typ_werte`)
    },
    zieljahr() {
      store.fetchTableByParentId(`apflora`, `ziel`, activeNodes.ap)
    },
    ziel() {
      store.fetchTableByParentId(`apflora`, `zielber`, activeNodes.ziel)
    },
    zielberFolder() {},
    zielber() {},
    popFolder() {},
    pop() {
      store.fetchTableByParentId(`apflora`, `tpop`, activeNodes.pop)
      store.fetchTableByParentId(`apflora`, `popber`, activeNodes.pop)
      store.fetchTable(`apflora`, `pop_entwicklung_werte`)
      store.fetchTableByParentId(`apflora`, `popmassnber`, activeNodes.pop)
      store.fetchTable(`apflora`, `tpopmassn_erfbeurt_werte`)
      store.fetchTable(`apflora`, `tpop_apberrelevant_werte`)
    },
    popberFolder() {},
    popmassnberFolder() {},
    tpopFolder() {},
    tpop() {
      store.fetchTable(`apflora`, `gemeinde`)
      store.fetchTable(`apflora`, `tpop_entwicklung_werte`)
      store.fetchTableByParentId(`apflora`, `tpopber`, activeNodes.tpop)
      store.fetchTableByParentId(`apflora`, `tpopmassnber`, activeNodes.tpop)
      store.fetchTableByParentId(`apflora`, `tpopmassn`, activeNodes.tpop)
      store.fetchTable(`apflora`, `tpopmassn_typ_werte`)
      store.fetchTableByParentId(`apflora`, `tpopkontr`, activeNodes.tpop)
    },
    tpopmassnFolder() {},
    tpopmassnberFolder() {},
    tpopfeldkontrFolder() {
      store.fetchTable(`apflora`, `tpopkontr_idbiotuebereinst_werte`)
      store.fetchTable(`beob`, `adb_lr`)
    },
    tpopfeldkontr() {
      store.fetchTableByParentId(`apflora`, `tpopkontrzaehl`, activeNodes.tpopfeldkontr)
      store.fetchTable(`apflora`, `tpopkontrzaehl_einheit_werte`)
      store.fetchTable(`apflora`, `tpopkontrzaehl_methode_werte`)
    },
    tpopfreiwkontrFolder() {},
    tpopfreiwkontr() {
      store.fetchTableByParentId(`apflora`, `tpopkontrzaehl`, activeNodes.tpopfreiwkontr)
      store.fetchTable(`apflora`, `tpopkontrzaehl_einheit_werte`)
      store.fetchTable(`apflora`, `tpopkontrzaehl_methode_werte`)
    },
    tpopkontrzaehlFolder() {},
    tpopberFolder() {},
    tpopbeobFolder() {
      store.fetchTable(`beob`, `beob_quelle`)
      store.fetchTpopForAp(activeNodes.ap)
      store.fetchBeobEvab(activeNodes.ap)
      store.fetchBeobInfospezies(activeNodes.ap)
    },
    tpopbeob() {
      const id = activeNodes.tpopbeob
      const table = (
        isNaN(id) ?
        `beob_evab` :
        `beob_infospezies`
      )
      store.fetchDatasetById({
        schemaName: `beob`,
        tableName: table,
        id,
      })
    },
  }

  runInAction(() => {
    forEach(fetchingFromActiveElements, (func, key) => {
      if (activeNodes[key]) {
        func()
      }
    })
  })
}

export default fetchDataForActiveNodes
