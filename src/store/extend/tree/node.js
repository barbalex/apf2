// @flow
import { extendObservable, computed } from 'mobx'

import nodes from '../../compute/nodes'

export default (store: Object, tree: Object): void => {
  extendObservable(tree.node, {
    nodes: computed(() => nodes(store, tree), { name: `nodesNode` })
  })
}
