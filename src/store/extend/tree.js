// @flow
import {
  extendObservable,
  action,
  computed,
  toJS,
} from 'mobx'
import clone from 'lodash/clone'

import toggleNode from '../action/toggleNode'
import toggleNodeSymbol from '../action/toggleNodeSymbol'
import toggleNextLowerNodes from '../action/toggleNextLowerNodes'
import getActiveNodes from '../../modules/getActiveNodes'
import setOpenNodesFromActiveNodeArray from '../action/setOpenNodesFromActiveNodeArray'

export default (store: Object, tree: Object): void => {
  extendObservable(tree, {
    /**
     * activeNodeArray is used to control tree and forms
     * url is computed from it
     */
    activeNodeArray: [],
    setActiveNodeArray: action(
      'setActiveNodeArray',
      nodeArray => (tree.activeNodeArray = nodeArray)
    ),
    activeNodes: computed(() => getActiveNodes(tree.activeNodeArray), {
      name: 'activeNodes',
    }),
    cloneActiveNodeArrayToTree2: action('cloneActiveNodeArrayToTree2', () => {
      store.tree2.activeNodeArray = clone(toJS(tree.activeNodeArray))
      store.tree2.openNodes = clone(toJS(tree.openNodes))
    }),
    openNodes: [],
    setOpenNodesFromActiveNodeArray: action(
      'setOpenNodesFromActiveNodeArray',
      () => setOpenNodesFromActiveNodeArray(store.tree)
    ),
    apFilter: false,
    // action when user clicks on a node in the tree
    toggleNode: action('toggleNode', (tree, node) =>
      toggleNode(store, tree, node)
    ),
    // action when user clicks on a node symbol in the tree
    toggleNodeSymbol: action('toggleNodeSymbol', (tree, node) =>
      toggleNodeSymbol(store, tree, node)
    ),
    toggleNextLowerNodes: action(
      'toggleNextLowerNodes',
      ({
        tree,
        id,
        menuType,
        nodes
      }: {
        tree: Object,
        id: String,
        menuType:String,
        nodes: Array < Object >
      }) =>
      toggleNextLowerNodes({
        tree,
        id,
        menuType,
        nodes
      })
    ),
  })
}