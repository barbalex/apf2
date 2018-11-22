// @flow

import nodeLabelFilter from './tree/nodeLabelFilter'
import treeMap from './tree/map'

export default {
  tree: {
    name: 'tree',
    activeNodeArray: [],
    openNodes: [],
    apFilter: false,
    nodeLabelFilter,
    map: treeMap,
    __typename: 'Tree',
  },
  tree2: {
    name: 'tree2',
    activeNodeArray: [],
    openNodes: [],
    apFilter: false,
    nodeLabelFilter,
    map: treeMap,
    __typename: 'Tree2',
  },
}
