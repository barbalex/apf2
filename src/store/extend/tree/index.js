// @flow
import {
  extendObservable,
  action,
  computed,
  reaction,
  observable,
  toJS,
} from 'mobx'
import clone from 'lodash/clone'

import toggleNode from '../../action/toggleNode'
import toggleNodeSymbol from '../../action/toggleNodeSymbol'
import toggleNextLowerNodes from '../../action/toggleNextLowerNodes'
import getActiveNodes from '../../../modules/getActiveNodes'
import updateActiveDatasetFromActiveNodes from '../../action/updateActiveDatasetFromActiveNodes'
import setOpenNodesFromActiveNodeArray from '../../action/setOpenNodesFromActiveNodeArray'

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
    activeNodes: computed(() => getActiveNodes(tree.activeNodeArray, store), {
      name: 'activeNodes',
    }),
    activeDataset: computed(
      () => updateActiveDatasetFromActiveNodes(store, tree), {
        name: 'activeDataset'
      }
    ),
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
    toggleApFilter: action('toggleApFilter', () => {
      tree.apFilter = !tree.apFilter
    }),
    nodeLabelFilter: observable.map({}),
    updateLabelFilter: action('updateLabelFilter', (table, value) => {
      if (!table) {
        return store.listError(
          new Error('nodeLabelFilter cant be updated: no table passed')
        )
      }
      tree.nodeLabelFilter.set(table, value)
    }),
    activeNodeFilter: {
      ap: computed(() => tree.activeNodes.ap, {
        name: 'activeNodeFilterAp'
      }),
    },
    applyMapFilterToTree: false,
    toggleApplyMapFilterToTree: action(
      'toggleApplyMapFilterToTree',
      () => (tree.applyMapFilterToTree = !tree.applyMapFilterToTree)
    ),
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
        node,
        nodes
      }: {
        tree: Object,
        node: Object,
        nodes: Array < Object >
      }) =>
      toggleNextLowerNodes({
        tree,
        node,
        nodes
      })
    ),
  })
  extendObservable(tree, {
    // empty all keys but ap when changing ap
    emptyTreeNodeLabelFilterOnChangeAp: reaction(
      () => tree.activeNodes.ap,
      ap => {
        tree.nodeLabelFilter.keys().forEach(key => {
          if (key !== 'ap') {
            tree.nodeLabelFilter.delete(key)
          }
        })
      }, {
        name: 'emptyTreeNodeLabelFilterOnChangeAp'
      }
    ),
  })
}