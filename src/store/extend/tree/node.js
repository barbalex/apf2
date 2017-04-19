// @flow
import { extendObservable, computed } from 'mobx'

import allNodes from '../../compute/nodes/allNodes'

export default (store: Object, tree: Object) => {
  extendObservable(tree.node, {
    nodes: computed(() => allNodes(store, tree), { name: `nodesNode` })
  })
}
