// @flow
import {
  extendObservable,
  action,
  computed,
  observable,
  toJS,
} from 'mobx'
import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'

import toggleNode from '../../action/toggleNode'
import getActiveNodes from '../../action/getActiveNodes'
import extendNode from './node'
import extendFilteredAndSorted from './filteredAndSorted'
import updateActiveDatasetFromActiveNodes from '../../action/updateActiveDatasetFromActiveNodes'

export default (store:Object) => {
  extendObservable(store.tree, {
    /**
     * url is used to control tree and forms
     * activeNodeArray is computed from it
     */
    activeNodeArray: [],
    setActiveNodeArray: action(
      `setActiveNodeArray`,
      (nodeArray) => store.tree.activeNodeArray = nodeArray
    ),
    activeNodes: computed(
      () => getActiveNodes(toJS(store.tree.activeNodeArray)),
      { name: `activeNodes` }
    ),
    activeNode: computed(
      () => store.tree.node.nodes.find(n =>
        isEqual(toJS(store.tree.activeNodeArray), n.url)
      ),
      { name: `activeNode` }
    ),
    activeDataset: computed(
      () => updateActiveDatasetFromActiveNodes(store, store.tree),
      { name: `activeDataset` }
    ),
    cloneActiveNodeArrayToTree2: action(
      `cloneActiveNodeArrayToTree2`,
      () => store.tree2.activeNodeArray = clone(toJS(store.tree.activeNodeArray))
    ),
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
        () => store.tree.activeNodes.ap,
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
  extendNode(store)
  extendFilteredAndSorted(store)
}
