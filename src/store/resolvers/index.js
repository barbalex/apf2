// @flow
import merge from 'lodash/merge'

import treeKey from './treeKey'
import exportKey from './exportKey'
import treeNodeLabelFilterKey from './treeNodeLabelFilterKey'
import treeNodeLabelFilter from './treeNodeLabelFilter'
import treeNodeLabelFilterResetExceptAp from './treeNodeLabelFilterResetExceptAp'
import treeMap from './treeMap'
import urlQuery from './urlQuery'
import login from './login'
import moving from './moving'
import copying from './copying'
import updateAvailable from './updateAvailable'
import assigningBeob from './assigningBeob'
import mapMouseCoordinates from './mapMouseCoordinates'
import copyingBiotop from './copyingBiotop'
import user from './user'
import cloneTree2From1 from './cloneTree2From1'
import errors from './errors'

export default merge(
  treeKey,
  exportKey,
  treeNodeLabelFilterKey,
  treeNodeLabelFilter,
  treeNodeLabelFilterResetExceptAp,
  treeMap,
  urlQuery,
  login,
  moving,
  copying,
  updateAvailable,
  assigningBeob,
  mapMouseCoordinates,
  copyingBiotop,
  user,
  cloneTree2From1,
  errors,
)
