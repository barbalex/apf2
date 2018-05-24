// @flow
import merge from 'lodash/merge'

import treeKey from './treeKey'
import exportKey from './exportKey'
import treeNodeLabelFilter from './treeNodeLabelFilter'
import treeMap from './treeMap'
import urlQuery from './urlQuery'
import login from './login'
import moving from './moving'
import copying from './copying'
import updateAvailable from './updateAvailable'
import mapMouseCoordinates from './mapMouseCoordinates'
import copyingBiotop from './copyingBiotop'
import user from './user'

export default merge(
  treeKey,
  exportKey,
  treeNodeLabelFilter,
  treeMap,
  urlQuery,
  login,
  moving,
  copying,
  updateAvailable,
  mapMouseCoordinates,
  copyingBiotop,
  user,
)
