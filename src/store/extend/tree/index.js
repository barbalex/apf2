// @flow
import {
  extendObservable,
  action,
  computed,
  observable,
} from 'mobx'

import toggleNode from '../../action/toggleNode'
import projektNodes from '../../compute/nodes/projekt'
import apFolderNodes from '../../compute/nodes/apFolder'
import apberuebersichtFolderNodes from '../../compute/nodes/apberuebersichtFolder'
import apberuebersichtNodes from '../../compute/nodes/apberuebersicht'
import apNodes from '../../compute/nodes/ap'
import allNodes from '../../compute/nodes/allNodes'
import qkFolderNode from '../../compute/nodes/qkFolder'
import assozartFolderNode from '../../compute/nodes/assozartFolder'
import assozartNode from '../../compute/nodes/assozart'
import idealbiotopFolderNode from '../../compute/nodes/idealbiotopFolder'
import beobNichtZuzuordnenFolderNode from '../../compute/nodes/beobNichtZuzuordnenFolder'
import beobNichtZuzuordnenNode from '../../compute/nodes/beobNichtZuzuordnen'
import beobzuordnungFolderNode from '../../compute/nodes/beobzuordnungFolder'
import beobzuordnungNode from '../../compute/nodes/beobzuordnung'
import berFolderNode from '../../compute/nodes/berFolder'
import berNode from '../../compute/nodes/ber'
import apberFolderNode from '../../compute/nodes/apberFolder'
import apberNode from '../../compute/nodes/apber'
import erfkritFolderNode from '../../compute/nodes/erfkritFolder'
import erfkritNode from '../../compute/nodes/erfkrit'
import zieljahreFolderNode from '../../compute/nodes/zieljahrFolder'
import zieljahrNode from '../../compute/nodes/zieljahr'
import zielNode from '../../compute/nodes/ziel'
import zielberFolderNode from '../../compute/nodes/zielberFolder'
import zielberNode from '../../compute/nodes/zielber'
import popFolderNode from '../../compute/nodes/popFolder'
import popNode from '../../compute/nodes/pop'
import popmassnberFolderNode from '../../compute/nodes/popmassnberFolder'
import popmassnberNode from '../../compute/nodes/popmassnber'
import popberFolderNode from '../../compute/nodes/popberFolder'
import popberNode from '../../compute/nodes/popber'
import tpopFolderNode from '../../compute/nodes/tpopFolder'
import tpopNode from '../../compute/nodes/tpop'
import tpopbeobFolderNode from '../../compute/nodes/tpopbeobFolder'
import tpopbeobNode from '../../compute/nodes/tpopbeob'
import tpopberFolderNode from '../../compute/nodes/tpopberFolder'
import tpopberNode from '../../compute/nodes/tpopber'
import tpopfreiwkontrFolderNode from '../../compute/nodes/tpopfreiwkontrFolder'
import tpopfreiwkontrNode from '../../compute/nodes/tpopfreiwkontr'
import tpopfreiwkontrzaehlFolderNode from '../../compute/nodes/tpopfreiwkontrzaehlFolder'
import tpopfreiwkontrzaehlNode from '../../compute/nodes/tpopfreiwkontrzaehl'
import tpopfeldkontrFolderNode from '../../compute/nodes/tpopfeldkontrFolder'
import tpopfeldkontrNode from '../../compute/nodes/tpopfeldkontr'
import tpopfeldkontrzaehlFolderNode from '../../compute/nodes/tpopfeldkontrzaehlFolder'
import tpopfeldkontrzaehlNode from '../../compute/nodes/tpopfeldkontrzaehl'
import tpopmassnberFolderNode from '../../compute/nodes/tpopmassnberFolder'
import tpopmassnberNode from '../../compute/nodes/tpopmassnber'
import tpopmassnFolderNode from '../../compute/nodes/tpopmassnFolder'
import tpopmassnNode from '../../compute/nodes/tpopmassn'

export default (store:Object) => {
  extendObservable(store.tree, {
    apFilter: false,
    toggleApFilter: action(`toggleApFilter`, () => {
      store.tree.apFilter = !store.tree.apFilter
    }),
    nodeLabelFilter: observable.map({}),
    updateLabelFilter: action(`updateLabelFilter`, (table, value) => {
      if (!table) {
        return store.listError(
          new Error(`nodeLabelFilter cant be updated: no table passed`)
        )
      }
      store.tree.nodeLabelFilter.set(table, value)
    }),
    activeNodeFilter: {
      ap: computed(
        () => store.activeNodes.ap,
        { name: `activeNodeFilterAp` }
      ),
    },
    applyMapFilterToTree: false,
    toggleApplyMapFilterToTree: action(
      `toggleApplyMapFilterToTree`,
      () => store.tree.applyMapFilterToTree = !store.tree.applyMapFilterToTree
    ),
    // action when user clicks on a node in the tree
    toggleNode: action(`toggleNode`, node =>
      toggleNode(store, node)
    ),
  })
  extendObservable(store.tree.node, {
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
