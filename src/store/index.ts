import { types } from 'mobx-state-tree'

import { Tree, defaultValue as defaultTree } from './Tree/index.ts'

export const MobxStore = types.model({
  tree: types.optional(Tree, defaultTree),
})
