// @flow
import {
  extendObservable,
  action,
  computed,
  observable,
} from 'mobx'

import toggleNode from '../modules/toggleNode'
import projektNodes from '../modules/nodes/projekt'
import apFolderNodes from '../modules/nodes/apFolder'
import apberuebersichtFolderNodes from '../modules/nodes/apberuebersichtFolder'
import apberuebersichtNodes from '../modules/nodes/apberuebersicht'
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
import tpopIdsInsideFeatureCollection from '../modules/tpopIdsInsideFeatureCollection'
import popIdsInsideFeatureCollection from '../modules/popIdsInsideFeatureCollection'
import beobNichtBeurteiltIdsInsideFeatureCollection from '../modules/beobNichtBeurteiltIdsInsideFeatureCollection'
import beobNichtZuzuordnenIdsInsideFeatureCollection from '../modules/beobNichtZuzuordnenIdsInsideFeatureCollection'
import tpopBeobIdsInsideFeatureCollection from '../modules/tpopBeobIdsInsideFeatureCollection'

export default (store:Object) => {
  extendObservable(store.node, {
    apFilter: false,
    toggleApFilter: action(`toggleApFilter`, () => {
      store.node.apFilter = !store.node.apFilter
    }),
    nodeLabelFilter: observable.map({}),
    applyNodeLabelFilterToExport: false,
    toggleApplyNodeLabelFilterToExport: action(
      `toggleApplyNodeLabelFilterToExport`,
      () => store.node.applyNodeLabelFilterToExport = !store.node.applyNodeLabelFilterToExport
    ),
    updateLabelFilter: action(`updateLabelFilter`, (table, value) => {
      if (!table) {
        return store.listError(
          new Error(`nodeLabelFilter cant be updated: no table passed`)
        )
      }
      store.node.nodeLabelFilter.set(table, value)
    }),
    activeNodeFilter: {
      ap: computed(
        () => store.activeUrlElements.ap,
        { name: `activeNodeFilterAp` }
      ),
    },
    applyActiveNodeFilterToExport: false,
    toggleApplyActiveNodeFilterToExport: action(
      `toggleApplyActiveNodeFilterToExport`,
      () => store.node.applyActiveNodeFilterToExport = !store.node.applyActiveNodeFilterToExport
    ),
    nodeMapFilter: {
      filter: {
        features: [],
      },
      pop: computed(
        () => popIdsInsideFeatureCollection(store, store.map.pop.pops),
        { name: `nodeMapFilterPop` }
      ),
      tpop: computed(
        () => tpopIdsInsideFeatureCollection(store, store.map.tpop.tpops),
        { name: `nodeMapFilterTpop` }
      ),
      beobNichtBeurteilt: computed(
        () => beobNichtBeurteiltIdsInsideFeatureCollection(store, store.map.beobNichtBeurteilt.beobs),
        { name: `nodeMapFilterBeobNichtBeurteilt` }
      ),
      beobNichtZuzuordnen: computed(
        () => beobNichtZuzuordnenIdsInsideFeatureCollection(store, store.map.beobNichtZuzuordnen.beobs),
        { name: `nodeMapFilterBeobNichtZuzuordnen` }
      ),
      tpopBeob: computed(
        () => tpopBeobIdsInsideFeatureCollection(store, store.map.tpopBeob.beobs),
        { name: `nodeMapFilterPTpopBeob` }
      ),
    },
    toggleApplyMapFilterToExport: action(
      `toggleApplyMapFilterToExport`,
      () => store.node.applyMapFilterToExport = !store.node.applyMapFilterToExport
    ),
    applyMapFilterToExport: false,
    applyMapFilterToTree: false,
    toggleApplyMapFilterToTree: action(
      `toggleApplyMapFilterToTree`,
      () => store.node.applyMapFilterToTree = !store.node.applyMapFilterToTree
    ),
    updateMapFilter: action(`updateMapFilter`, (mapFilterItems) => {
      if (!mapFilterItems) {
        return store.node.nodeMapFilter.filter = { features: [] }
      }
      store.node.nodeMapFilter.filter = mapFilterItems.toGeoJSON()
    }),
    // action when user clicks on a node in the tree
    toggleNode: action(`toggleNode`, node =>
      toggleNode(store, node)
    ),
  })
  extendObservable(store.node.nodeMapFilter.filter, {
    features: [],
  })
  extendObservable(store.node.node, {
    projekt: computed(
      () => projektNodes(store),
      { name: `` }
    ),
    apFolder: computed(
      () => apFolderNodes(store),
      { name: `apFolderNode` }
    ),
    apberuebersichtFolder: computed(
      () => apberuebersichtFolderNodes(store),
      { name: `apberuebersichtFolderNode` }
    ),
    apberuebersicht: computed(
      () => apberuebersichtNodes(store),
      { name: `apberuebersichtNode` }
    ),
    ap: computed(
      () => apNodes(store),
      { name: `apNode` }
    ),
    nodes: computed(
      () => allNodes(store),
      { name: `nodesNode` }
    ),
    qkFolder: computed(
      () => qkFolderNode(store),
    ),
    assozartFolder: computed(
      () => assozartFolderNode(store),
      { name: `assozartFolderNode` }
    ),
    assozart: computed(
      () => assozartNode(store),
      { name: `assozartNode` }
    ),
    idealbiotopFolder: computed(
      () => idealbiotopFolderNode(store),
      { name: `idealbiotopFolderNode` }
    ),
    beobNichtZuzuordnenFolder: computed(
      () => beobNichtZuzuordnenFolderNode(store),
      { name: `beobNichtZuzuordnenFolderNode` }
    ),
    beobNichtZuzuordnen: computed(
      () => beobNichtZuzuordnenNode(store),
      { name: `beobNichtZuzuordnenNode` }
    ),
    beobzuordnungFolder: computed(
      () => beobzuordnungFolderNode(store),
      { name: `beobzuordnungFolderNode` }
    ),
    beobzuordnung: computed(
      () => beobzuordnungNode(store),
      { name: `beobzuordnungNode` }
    ),
    berFolder: computed(
      () => berFolderNode(store),
      { name: `berFolderNode` }
    ),
    ber: computed(
      () => berNode(store),
      { name: `berNode` }
    ),
    apberFolder: computed(
      () => apberFolderNode(store),
      { name: `apberFolderNode` }
    ),
    apber: computed(
      () => apberNode(store),
      { name: `apberNode` }
    ),
    erfkritFolder: computed(
      () => erfkritFolderNode(store),
      { name: `erfkritFolderNode` }
    ),
    erfkrit: computed(
      () => erfkritNode(store),
      { name: `erfkritNode` }
    ),
    zieljahrFolder: computed(
      () => zieljahreFolderNode(store),
      { name: `zieljahrFolderNode` }
    ),
    zieljahr: computed(
      () => zieljahrNode(store),
      { name: `zieljahrNode` }
    ),
    ziel: computed(
      () => zielNode(store),
      { name: `zielNode` }
    ),
    zielberFolder: computed(
      () => zielberFolderNode(store),
      { name: `zielberFolderNode` }
    ),
    zielber: computed(
      () => zielberNode(store),
      { name: `zielberNode` }
    ),
    popFolder: computed(
      () => popFolderNode(store),
      { name: `popFolderNode` }
    ),
    pop: computed(
      () => popNode(store),
      { name: `popNode` }
    ),
    popmassnberFolder: computed(
      () => popmassnberFolderNode(store),
      { name: `popmassnberFolderNode` }
    ),
    popmassnber: computed(
      () => popmassnberNode(store),
      { name: `popmassnberNode` }
    ),
    popberFolder: computed(
      () => popberFolderNode(store),
      { name: `popberFolderNode` }
    ),
    popber: computed(
      () => popberNode(store),
      { name: `popberNode` }
    ),
    tpopFolder: computed(
      () => tpopFolderNode(store),
      { name: `tpopFolderNode` }
    ),
    tpop: computed(
      () => tpopNode(store),
      { name: `tpopNode` }
    ),
    tpopbeobFolder: computed(
      () => tpopbeobFolderNode(store),
      { name: `tpopbeobFolderNode` }
    ),
    tpopbeob: computed(
      () => tpopbeobNode(store),
      { name: `tpopbeobNode` }
    ),
    tpopberFolder: computed(
      () => tpopberFolderNode(store),
      { name: `tpopberFolderNode` }
    ),
    tpopber: computed(
      () => tpopberNode(store),
      { name: `tpopberNode` }
    ),
    tpopfreiwkontrFolder: computed(
      () => tpopfreiwkontrFolderNode(store),
      { name: `tpopfreiwkontrFolderNode` }
    ),
    tpopfreiwkontr: computed(
      () => tpopfreiwkontrNode(store),
      { name: `tpopfreiwkontrNode` }
    ),
    tpopfreiwkontrzaehlFolder: computed(
      () => tpopfreiwkontrzaehlFolderNode(store),
      { name: `tpopfreiwkontrzaehlFolderNode` }
    ),
    tpopfreiwkontrzaehl: computed(
      () => tpopfreiwkontrzaehlNode(store),
      { name: `tpopfreiwkontrzaehlNode` }
    ),
    tpopfeldkontrFolder: computed(
      () => tpopfeldkontrFolderNode(store),
      { name: `tpopfeldkontrFolderNode` }
    ),
    tpopfeldkontr: computed(
      () => tpopfeldkontrNode(store),
      { name: `tpopfeldkontrNode` }
    ),
    tpopfeldkontrzaehlFolder: computed(
      () => tpopfeldkontrzaehlFolderNode(store),
      { name: `tpopfeldkontrzaehlFolderNode` }
    ),
    tpopfeldkontrzaehl: computed(
      () => tpopfeldkontrzaehlNode(store),
      { name: `tpopfeldkontrzaehlNode` }
    ),
    tpopmassnberFolder: computed(
      () => tpopmassnberFolderNode(store),
      { name: `tpopmassnberFolderNode` }
    ),
    tpopmassnber: computed(
      () => tpopmassnberNode(store),
      { name: `tpopmassnberNode` }
    ),
    tpopmassnFolder: computed(
      () => tpopmassnFolderNode(store),
      { name: `tpopmassnFolderNode` }
    ),
    tpopmassn: computed(
      () => tpopmassnNode(store),
      { name: `tpopmassnNode` }
    ),
  })
}
