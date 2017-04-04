// @flow
import {
  extendObservable,
  action,
  computed,
  observable,
  toJS,
} from 'mobx'

import toggleNode from '../../action/toggleNodeTree2'
import getActiveNodes from '../../action/getActiveNodes'
import extendNode from './node'
import extendFilteredAndSorted from './filteredAndSorted'

export default (store:Object) => {
  extendObservable(store.tree2, {
    /**
     * in tree2 activeNodeArray is cloned from tree on mount
     * using store.tree.cloneActiveNodeArrayToTree2
     * then is changed on nodes click
     * fetchDataForActiveNodes is called by autorun fetchDataWhenActiveNodeArrayChanges
     */
    activeNodeArray: [],
    setActiveNodeArray: action(
      `setActiveNodeArray`,
      (nodeArray) => store.tree2.activeNodeArray = nodeArray
    ),
    activeNodes: computed(
      // in tree2: pass it's own activeNodeArray
      () => getActiveNodes(toJS(store.tree2.activeNodeArray)),
      { name: `activeNodes` }
    ),
    apFilter: false,
    toggleApFilter: action(`toggleApFilter`, () => {
      store.tree2.apFilter = !store.tree2.apFilter
    }),
    nodeLabelFilter: observable.map({}),
    updateLabelFilter: action(`updateLabelFilter`, (table, value) => {
      if (!table) {
        return store.listError(
          new Error(`nodeLabelFilter cant be updated: no table passed`)
        )
      }
      store.tree2.nodeLabelFilter.set(table, value)
    }),
    activeNodeFilter: {
      ap: computed(
        () => store.tree2.activeNodes.ap,
        { name: `activeNodeFilterAp` }
      ),
    },
    applyMapFilterToTree: false,
    toggleApplyMapFilterToTree: action(
      `toggleApplyMapFilterToTree`,
      () => store.tree2.applyMapFilterToTree = !store.tree2.applyMapFilterToTree
    ),
    // action when user clicks on a node in the tree
    toggleNode: action(`toggleNode`, node =>
      toggleNode(store, node)
    ),
  })
  extendNode(store)
  extendFilteredAndSorted(store)
}
