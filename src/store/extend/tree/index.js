// @flow
import {
  extendObservable,
  action,
  computed,
  observable,
} from 'mobx'

import toggleNode from '../../action/toggleNode'
import getActiveNodes from '../../action/getActiveNodes'
import getActiveNodeArrayFromPathname from '../../action/getActiveNodeArrayFromPathname'
import extendNode from './node'
import extendFilteredAndSorted from './filteredAndSorted'

export default (store:Object) => {
  extendObservable(store.tree, {
    /**
     * url is used to control tree and forms
     * activeNodeArray is computed from it
     */
    /**
     * in tree2 activeNodeArray is cloned from tree on mount
     * then is changed on click on nodes
     * when fetchDataForActiveNodes is also called (autorun?)
     */
    activeNodeArray: computed(
      () => getActiveNodeArrayFromPathname(store.history.location.pathname),
      { name: `activeNodeArray` }
    ),
    activeNodes: computed(
      // in tree2: pass it's own activeNodeArray
      () => getActiveNodes(store.tree.activeNodeArray),
      { name: `activeNodes` }
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
