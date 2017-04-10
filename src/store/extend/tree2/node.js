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

export default (store: Object) => {
  extendObservable(store.tree2.node, {
    projekt: computed(
      () => projektNodes(store, store.tree2),
      { name: `` }
    ),
    apFolder: computed(
      () => apFolderNodes(store, store.tree2),
      { name: `apFolderNode` }
    ),
    apberuebersichtFolder: computed(
      () => apberuebersichtFolderNodes(store, store.tree2),
      { name: `apberuebersichtFolderNode` }
    ),
    apberuebersicht: computed(
      () => apberuebersichtNodes(store, store.tree2),
      { name: `apberuebersichtNode` }
    ),
    ap: computed(
      () => apNodes(store, store.tree2),
      { name: `apNode` }
    ),
    nodes: computed(
      () => allNodes(store, store.tree2),
      { name: `nodesNode` }
    ),
    qkFolder: computed(
      () => qkFolderNode(store, store.tree2),
    ),
    assozartFolder: computed(
      () => assozartFolderNode(store, store.tree2),
      { name: `assozartFolderNode` }
    ),
    assozart: computed(
      () => assozartNode(store, store.tree2),
      { name: `assozartNode` }
    ),
    idealbiotopFolder: computed(
      () => idealbiotopFolderNode(store, store.tree2),
      { name: `idealbiotopFolderNode` }
    ),
    beobNichtZuzuordnenFolder: computed(
      () => beobNichtZuzuordnenFolderNode(store, store.tree2),
      { name: `beobNichtZuzuordnenFolderNode` }
    ),
    beobNichtZuzuordnen: computed(
      () => beobNichtZuzuordnenNode(store, store.tree2),
      { name: `beobNichtZuzuordnenNode` }
    ),
    beobzuordnungFolder: computed(
      () => beobzuordnungFolderNode(store, store.tree2),
      { name: `beobzuordnungFolderNode` }
    ),
    beobzuordnung: computed(
      () => beobzuordnungNode(store, store.tree2),
      { name: `beobzuordnungNode` }
    ),
    berFolder: computed(
      () => berFolderNode(store, store.tree2),
      { name: `berFolderNode` }
    ),
    ber: computed(
      () => berNode(store, store.tree2),
      { name: `berNode` }
    ),
    apberFolder: computed(
      () => apberFolderNode(store, store.tree2),
      { name: `apberFolderNode` }
    ),
    apber: computed(
      () => apberNode(store, store.tree2),
      { name: `apberNode` }
    ),
    erfkritFolder: computed(
      () => erfkritFolderNode(store, store.tree2),
      { name: `erfkritFolderNode` }
    ),
    erfkrit: computed(
      () => erfkritNode(store, store.tree2),
      { name: `erfkritNode` }
    ),
    zieljahrFolder: computed(
      () => zieljahreFolderNode(store, store.tree2),
      { name: `zieljahrFolderNode` }
    ),
    zieljahr: computed(
      () => zieljahrNode(store, store.tree2),
      { name: `zieljahrNode` }
    ),
    ziel: computed(
      () => zielNode(store, store.tree2),
      { name: `zielNode` }
    ),
    zielberFolder: computed(
      () => zielberFolderNode(store, store.tree2),
      { name: `zielberFolderNode` }
    ),
    zielber: computed(
      () => zielberNode(store, store.tree2),
      { name: `zielberNode` }
    ),
    popFolder: computed(
      () => popFolderNode(store, store.tree2),
      { name: `popFolderNode` }
    ),
    pop: computed(
      () => popNode(store, store.tree2),
      { name: `popNode` }
    ),
    popmassnberFolder: computed(
      () => popmassnberFolderNode(store, store.tree2),
      { name: `popmassnberFolderNode` }
    ),
    popmassnber: computed(
      () => popmassnberNode(store, store.tree2),
      { name: `popmassnberNode` }
    ),
    popberFolder: computed(
      () => popberFolderNode(store, store.tree2),
      { name: `popberFolderNode` }
    ),
    popber: computed(
      () => popberNode(store, store.tree2),
      { name: `popberNode` }
    ),
    tpopFolder: computed(
      () => tpopFolderNode(store, store.tree2),
      { name: `tpopFolderNode` }
    ),
    tpop: computed(
      () => tpopNode(store, store.tree2),
      { name: `tpopNode` }
    ),
    tpopbeobFolder: computed(
      () => tpopbeobFolderNode(store, store.tree2),
      { name: `tpopbeobFolderNode` }
    ),
    tpopbeob: computed(
      () => tpopbeobNode(store, store.tree2),
      { name: `tpopbeobNode` }
    ),
    tpopberFolder: computed(
      () => tpopberFolderNode(store, store.tree2),
      { name: `tpopberFolderNode` }
    ),
    tpopber: computed(
      () => tpopberNode(store, store.tree2),
      { name: `tpopberNode` }
    ),
    tpopfreiwkontrFolder: computed(
      () => tpopfreiwkontrFolderNode(store, store.tree2),
      { name: `tpopfreiwkontrFolderNode` }
    ),
    tpopfreiwkontr: computed(
      () => tpopfreiwkontrNode(store, store.tree2),
      { name: `tpopfreiwkontrNode` }
    ),
    tpopfreiwkontrzaehlFolder: computed(
      () => tpopfreiwkontrzaehlFolderNode(store, store.tree2),
      { name: `tpopfreiwkontrzaehlFolderNode` }
    ),
    tpopfreiwkontrzaehl: computed(
      () => tpopfreiwkontrzaehlNode(store, store.tree2),
      { name: `tpopfreiwkontrzaehlNode` }
    ),
    tpopfeldkontrFolder: computed(
      () => tpopfeldkontrFolderNode(store, store.tree2),
      { name: `tpopfeldkontrFolderNode` }
    ),
    tpopfeldkontr: computed(
      () => tpopfeldkontrNode(store, store.tree2),
      { name: `tpopfeldkontrNode` }
    ),
    tpopfeldkontrzaehlFolder: computed(
      () => tpopfeldkontrzaehlFolderNode(store, store.tree2),
      { name: `tpopfeldkontrzaehlFolderNode` }
    ),
    tpopfeldkontrzaehl: computed(
      () => tpopfeldkontrzaehlNode(store, store.tree2),
      { name: `tpopfeldkontrzaehlNode` }
    ),
    tpopmassnberFolder: computed(
      () => tpopmassnberFolderNode(store, store.tree2),
      { name: `tpopmassnberFolderNode` }
    ),
    tpopmassnber: computed(
      () => tpopmassnberNode(store, store.tree2),
      { name: `tpopmassnberNode` }
    ),
    tpopmassnFolder: computed(
      () => tpopmassnFolderNode(store, store.tree2),
      { name: `tpopmassnFolderNode` }
    ),
    tpopmassn: computed(
      () => tpopmassnNode(store, store.tree2),
      { name: `tpopmassnNode` }
    ),
  })
}
