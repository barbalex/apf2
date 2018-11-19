import { types } from 'mobx-state-tree'

import NodeFilterTree from './NodeFilterTree/types'
import initialNodeFilterTreeValues from './NodeFilterTree/initialValues'

export default types.model('NodeFilter', {
  tree: types.optional(NodeFilterTree, initialNodeFilterTreeValues),
  tree2: types.optional(NodeFilterTree, initialNodeFilterTreeValues),
})

export const defaultValue = {
  tree: initialNodeFilterTreeValues,
  tree2: initialNodeFilterTreeValues,
}
