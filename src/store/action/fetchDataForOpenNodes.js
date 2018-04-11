// @flow
/**
 * Problem: Same data is refetched very often
 * Idea 1: Compare activeNodes with previous activeNodes
 * and only fetch what is new
 */

import { runInAction } from 'mobx'
import forEach from 'lodash/forEach'
import isEqual from 'lodash/isEqual'
import uniq from 'lodash/uniq'
import difference from 'lodash/difference'
import { toJS } from 'mobx'

import getActiveNodes from './getActiveNodes'

const fetchDataForOpenNodes = (
  store: Object,
  tree: Object,
  showPop: boolean,
  showTpop: boolean,
  showTpopBeob: boolean,
  showBeobNichtBeurteilt: boolean,
  showBeobNichtZuzuordnen: boolean
): void => {
  const openNodes = toJS(tree.openNodes)

  // first reduce nodeArrays to minimum
  // idea: check for each node if is included in other
  // if true: remove
  let nodesToRemove = []
  openNodes.forEach(node => {
    openNodes.forEach((n, index) => {
      if (n.length < node.length) {
        const nodePartWithEqualLength = node.slice(0, n.length)
        if (isEqual(nodePartWithEqualLength, n)) {
          nodesToRemove.push(n)
        }
      } else if (n.length > node.length) {
        const nPartWithEqualLength = n.slice(0, node.length)
        if (isEqual(nPartWithEqualLength, node)) {
          nodesToRemove.push(node)
        }
      }
    })
  })
  const uniqNodesToRemove = uniq(nodesToRemove)
  const openNodesToUse = difference(openNodes, uniqNodesToRemove)

  openNodesToUse.forEach(node => {
    const activeNodes = getActiveNodes(node, store)
    const fetchingFromActiveElements = {
      exporte() {
        store.fetchTableByParentId('ap', activeNodes.projekt)
        store.fetchTable('ae_eigenschaften')
      },
      projektFolder() {
        store.fetchTable('projekt')
      },
      projekt() {
        store.fetchTableByParentId('ap', activeNodes.projekt)
        store.fetchTableByParentId('apberuebersicht', activeNodes.projekt)
      },
      apberuebersichtFolder() {
        store.fetchTableByParentId('apberuebersicht', activeNodes.projekt)
      },
      apFolder() {
        store.fetchTable('ae_eigenschaften')
      },
      ap() {
        store.fetchTableByParentId('pop', activeNodes.ap)
        store.fetchTableByParentId('ziel', activeNodes.ap)
        store.fetchTableByParentId('erfkrit', activeNodes.ap)
        store.fetchTableByParentId('apber', activeNodes.ap)
        store.fetchTableByParentId('ber', activeNodes.ap)
        store.fetchTableByParentId('assozart', activeNodes.ap)
        store.fetchTableByParentId('idealbiotop', activeNodes.ap)
        store.fetchTable('adresse')
        store.fetchTable('ap_bearbstand_werte')
        store.fetchTable('ap_umsetzung_werte')
        store.fetchTable('beobart')
        store.fetchBeob(activeNodes.ap)
        store.fetchBeobzuordnung(activeNodes.ap)
        store.fetchTable('pop_status_werte')
        if (showTpop) {
          store.fetchTpopForAp(activeNodes.ap)
          store.fetchPopForAp(activeNodes.ap)
        }
        if (showPop) {
          store.fetchPopForAp(activeNodes.ap)
        }
        if (showBeobNichtBeurteilt || showBeobNichtZuzuordnen || showTpopBeob) {
          store.fetchTable('beob_quelle')
          store.fetchPopForAp(activeNodes.ap)
          store.fetchTpopForAp(activeNodes.ap)
        }
      },
      qk() {
        // not necessary any more as form loads data on mount
      },
      assozartFolder() {},
      beobArtFolder() {},
      idealbiotopFolder() {},
      beobNichtZuzuordnenFolder() {
        store.fetchTable('beob_quelle')
        store.fetchTpopForAp(activeNodes.ap)
      },
      beobNichtZuzuordnen() {
        store.fetchDatasetById({
          tableName: 'beob',
          id: activeNodes.beobNichtZuzuordnen,
        })
      },
      beobzuordnungFolder() {
        store.fetchTable('beob_quelle')
        store.fetchTpopForAp(activeNodes.ap)
      },
      beobzuordnung() {},
      berFolder() {
        store.fetchTableByParentId('ber', activeNodes.ap)
      },
      apberFolder() {
        store.fetchTableByParentId('apber', activeNodes.ap)
        store.fetchTable('ap_erfkrit_werte')
      },
      erfkritFolder() {
        store.fetchTableByParentId('erfkrit', activeNodes.ap)
        store.fetchTable('ap_erfkrit_werte')
      },
      zielFolder() {
        store.fetchTableByParentId('ziel', activeNodes.ap)
        store.fetchTable('ziel_typ_werte')
      },
      zieljahr() {
        store.fetchTableByParentId('ziel', activeNodes.ap)
      },
      ziel() {
        store.fetchTableByParentId('zielber', activeNodes.ziel)
      },
      zielberFolder() {},
      zielber() {},
      popFolder() {},
      pop() {
        store.fetchTableByParentId('tpop', activeNodes.pop)
        store.fetchTableByParentId('popber', activeNodes.pop)
        store.fetchTable('tpop_entwicklung_werte')
        store.fetchTableByParentId('popmassnber', activeNodes.pop)
        store.fetchTable('tpopmassn_erfbeurt_werte')
        store.fetchTable('tpop_apberrelevant_werte')
      },
      popberFolder() {},
      popmassnberFolder() {},
      tpopFolder() {},
      tpop() {
        store.fetchTable('gemeinde')
        //store.fetchTable('tpop_entwicklung_werte')
        store.fetchTableByParentId('tpopber', activeNodes.tpop)
        store.fetchTableByParentId('tpopmassnber', activeNodes.tpop)
        store.fetchTableByParentId('tpopmassn', activeNodes.tpop)
        store.fetchTable('tpopmassn_typ_werte')
        store.fetchTableByParentId('tpopkontr', activeNodes.tpop)
      },
      tpopmassnFolder() {},
      tpopmassnberFolder() {},
      tpopfeldkontrFolder() {
        store.fetchTable('tpopkontr_idbiotuebereinst_werte')
        store.fetchTable('ae_lrdelarze')
      },
      tpopfeldkontr() {
        store.fetchTableByParentId('tpopkontrzaehl', activeNodes.tpopfeldkontr)
        store.fetchTable('tpopkontrzaehl_einheit_werte')
        store.fetchTable('tpopkontrzaehl_methode_werte')
      },
      tpopfreiwkontrFolder() {},
      tpopfreiwkontr() {
        store.fetchTableByParentId('tpopkontrzaehl', activeNodes.tpopfreiwkontr)
        store.fetchTable('tpopkontrzaehl_einheit_werte')
        store.fetchTable('tpopkontrzaehl_methode_werte')
      },
      tpopkontrzaehlFolder() {},
      tpopberFolder() {},
      tpopbeobFolder() {
        store.fetchTable('beob_quelle')
        store.fetchTpopForAp(activeNodes.ap)
      },
      tpopbeob() {
        store.fetchDatasetById({
          tableName: 'beob',
          id: activeNodes.tpopbeob,
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
  })
}

export default fetchDataForOpenNodes
