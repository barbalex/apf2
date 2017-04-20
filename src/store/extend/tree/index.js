// @flow
import { extendObservable, action, computed, observable, toJS } from 'mobx'
import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'

import toggleNode from '../../action/toggleNode'
import toggleNodeSymbol from '../../action/toggleNodeSymbol'
import getActiveNodes from '../../action/getActiveNodes'
import extendNode from './node'
import extendFilteredAndSorted from './filteredAndSorted'
import updateActiveDatasetFromActiveNodes
  from '../../action/updateActiveDatasetFromActiveNodes'
import nodes from '../../compute/nodes'
import setOpenNodesFromActiveNodeArray
  from '../../action/setOpenNodesFromActiveNodeArray'

export default (store: Object, tree: Object) => {
  extendObservable(tree, {
    /**
     * activeNodeArray is used to control tree and forms
     * url is computed from it
     */
    activeNodeArray: [],
    setActiveNodeArray: action(
      `setActiveNodeArray`,
      nodeArray => tree.activeNodeArray = nodeArray
    ),
    activeNodes: computed(() => getActiveNodes(tree.activeNodeArray), {
      name: `activeNodes`
    }),
    activeNode: computed(
      () => {
        const myNodes = nodes(store, tree)
        return myNodes.find(n => isEqual(toJS(tree.activeNodeArray), n.url))
      },
      { name: `activeNode` }
    ),
    activeDataset: computed(
      () => updateActiveDatasetFromActiveNodes(store, tree),
      { name: `activeDataset` }
    ),
    cloneActiveNodeArrayToTree2: action(
      `cloneActiveNodeArrayToTree2`,
      () => store.tree2.activeNodeArray = clone(toJS(tree.activeNodeArray))
    ),
    openNodes: [],
    setOpenNodesFromActiveNodeArray: action(
      `setOpenNodesFromActiveNodeArray`,
      () => setOpenNodesFromActiveNodeArray(store.tree)
    ),
    apFilter: false,
    toggleApFilter: action(`toggleApFilter`, () => {
      tree.apFilter = !tree.apFilter
    }),
    nodeLabelFilter: observable.map({}),
    updateLabelFilter: action(`updateLabelFilter`, (table, value) => {
      if (!table) {
        return store.listError(
          new Error(`nodeLabelFilter cant be updated: no table passed`)
        )
      }
      tree.nodeLabelFilter.set(table, value)
    }),
    activeNodeFilter: {
      ap: computed(() => tree.activeNodes.ap, { name: `activeNodeFilterAp` })
    },
    applyMapFilterToTree: false,
    toggleApplyMapFilterToTree: action(
      `toggleApplyMapFilterToTree`,
      () => tree.applyMapFilterToTree = !tree.applyMapFilterToTree
    ),
    // action when user clicks on a node in the tree
    toggleNode: action(`toggleNode`, (tree, node) =>
      toggleNode(store, tree, node)
    ),
    // action when user clicks on a node symbol in the tree
    toggleNodeSymbol: action(`toggleNodeSymbol`, (tree, node) =>
      toggleNodeSymbol(store, tree, node)
    )
  })
  extendNode(store, tree)
  extendFilteredAndSorted(store, tree)
}
