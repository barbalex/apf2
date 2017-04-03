// @flow
import {
  extendObservable,
  computed,
} from 'mobx'

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
  extendObservable(store.tree.node, {
    projekt: computed(
      () => projektNodes(store, store.tree),
      { name: `` }
    ),
    apFolder: computed(
      () => apFolderNodes(store, store.tree),
      { name: `apFolderNode` }
    ),
    apberuebersichtFolder: computed(
      () => apberuebersichtFolderNodes(store, store.tree),
      { name: `apberuebersichtFolderNode` }
    ),
    apberuebersicht: computed(
      () => apberuebersichtNodes(store, store.tree),
      { name: `apberuebersichtNode` }
    ),
    ap: computed(
      () => apNodes(store, store.tree),
      { name: `apNode` }
    ),
    nodes: computed(
      () => allNodes(store, store.tree),
      { name: `nodesNode` }
    ),
    qkFolder: computed(
      () => qkFolderNode(store, store.tree),
    ),
    assozartFolder: computed(
      () => assozartFolderNode(store, store.tree),
      { name: `assozartFolderNode` }
    ),
    assozart: computed(
      () => assozartNode(store, store.tree),
      { name: `assozartNode` }
    ),
    idealbiotopFolder: computed(
      () => idealbiotopFolderNode(store, store.tree),
      { name: `idealbiotopFolderNode` }
    ),
    beobNichtZuzuordnenFolder: computed(
      () => beobNichtZuzuordnenFolderNode(store, store.tree),
      { name: `beobNichtZuzuordnenFolderNode` }
    ),
    beobNichtZuzuordnen: computed(
      () => beobNichtZuzuordnenNode(store, store.tree),
      { name: `beobNichtZuzuordnenNode` }
    ),
    beobzuordnungFolder: computed(
      () => beobzuordnungFolderNode(store, store.tree),
      { name: `beobzuordnungFolderNode` }
    ),
    beobzuordnung: computed(
      () => beobzuordnungNode(store, store.tree),
      { name: `beobzuordnungNode` }
    ),
    berFolder: computed(
      () => berFolderNode(store, store.tree),
      { name: `berFolderNode` }
    ),
    ber: computed(
      () => berNode(store, store.tree),
      { name: `berNode` }
    ),
    apberFolder: computed(
      () => apberFolderNode(store, store.tree),
      { name: `apberFolderNode` }
    ),
    apber: computed(
      () => apberNode(store, store.tree),
      { name: `apberNode` }
    ),
    erfkritFolder: computed(
      () => erfkritFolderNode(store, store.tree),
      { name: `erfkritFolderNode` }
    ),
    erfkrit: computed(
      () => erfkritNode(store, store.tree),
      { name: `erfkritNode` }
    ),
    zieljahrFolder: computed(
      () => zieljahreFolderNode(store, store.tree),
      { name: `zieljahrFolderNode` }
    ),
    zieljahr: computed(
      () => zieljahrNode(store, store.tree),
      { name: `zieljahrNode` }
    ),
    ziel: computed(
      () => zielNode(store, store.tree),
      { name: `zielNode` }
    ),
    zielberFolder: computed(
      () => zielberFolderNode(store, store.tree),
      { name: `zielberFolderNode` }
    ),
    zielber: computed(
      () => zielberNode(store, store.tree),
      { name: `zielberNode` }
    ),
    popFolder: computed(
      () => popFolderNode(store, store.tree),
      { name: `popFolderNode` }
    ),
    pop: computed(
      () => popNode(store, store.tree),
      { name: `popNode` }
    ),
    popmassnberFolder: computed(
      () => popmassnberFolderNode(store, store.tree),
      { name: `popmassnberFolderNode` }
    ),
    popmassnber: computed(
      () => popmassnberNode(store, store.tree),
      { name: `popmassnberNode` }
    ),
    popberFolder: computed(
      () => popberFolderNode(store, store.tree),
      { name: `popberFolderNode` }
    ),
    popber: computed(
      () => popberNode(store, store.tree),
      { name: `popberNode` }
    ),
    tpopFolder: computed(
      () => tpopFolderNode(store, store.tree),
      { name: `tpopFolderNode` }
    ),
    tpop: computed(
      () => tpopNode(store, store.tree),
      { name: `tpopNode` }
    ),
    tpopbeobFolder: computed(
      () => tpopbeobFolderNode(store, store.tree),
      { name: `tpopbeobFolderNode` }
    ),
    tpopbeob: computed(
      () => tpopbeobNode(store, store.tree),
      { name: `tpopbeobNode` }
    ),
    tpopberFolder: computed(
      () => tpopberFolderNode(store, store.tree),
      { name: `tpopberFolderNode` }
    ),
    tpopber: computed(
      () => tpopberNode(store, store.tree),
      { name: `tpopberNode` }
    ),
    tpopfreiwkontrFolder: computed(
      () => tpopfreiwkontrFolderNode(store, store.tree),
      { name: `tpopfreiwkontrFolderNode` }
    ),
    tpopfreiwkontr: computed(
      () => tpopfreiwkontrNode(store, store.tree),
      { name: `tpopfreiwkontrNode` }
    ),
    tpopfreiwkontrzaehlFolder: computed(
      () => tpopfreiwkontrzaehlFolderNode(store, store.tree),
      { name: `tpopfreiwkontrzaehlFolderNode` }
    ),
    tpopfreiwkontrzaehl: computed(
      () => tpopfreiwkontrzaehlNode(store, store.tree),
      { name: `tpopfreiwkontrzaehlNode` }
    ),
    tpopfeldkontrFolder: computed(
      () => tpopfeldkontrFolderNode(store, store.tree),
      { name: `tpopfeldkontrFolderNode` }
    ),
    tpopfeldkontr: computed(
      () => tpopfeldkontrNode(store, store.tree),
      { name: `tpopfeldkontrNode` }
    ),
    tpopfeldkontrzaehlFolder: computed(
      () => tpopfeldkontrzaehlFolderNode(store, store.tree),
      { name: `tpopfeldkontrzaehlFolderNode` }
    ),
    tpopfeldkontrzaehl: computed(
      () => tpopfeldkontrzaehlNode(store, store.tree),
      { name: `tpopfeldkontrzaehlNode` }
    ),
    tpopmassnberFolder: computed(
      () => tpopmassnberFolderNode(store, store.tree),
      { name: `tpopmassnberFolderNode` }
    ),
    tpopmassnber: computed(
      () => tpopmassnberNode(store, store.tree),
      { name: `tpopmassnberNode` }
    ),
    tpopmassnFolder: computed(
      () => tpopmassnFolderNode(store, store.tree),
      { name: `tpopmassnFolderNode` }
    ),
    tpopmassn: computed(
      () => tpopmassnNode(store, store.tree),
      { name: `tpopmassnNode` }
    ),
  })
}
