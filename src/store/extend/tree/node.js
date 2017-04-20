// @flow
import { extendObservable, computed } from 'mobx'

import nodes from '../../compute/nodes'

export default (store: Object, tree: Object) => {
  extendObservable(tree.node, {
    nodes: computed(() => nodes(store, tree), { name: `nodesNode` })
  })
}
