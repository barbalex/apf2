// @flow
import merge from 'lodash/merge'

import treeKey from './treeKey'
import exportKey from './exportKey'
import treeNodeLabelFilterKey from './treeNodeLabelFilterKey'
import treeMap from './treeMap'
import urlQuery from './urlQuery'
import login from './login'
import moving from './moving'
import copying from './copying'
import updateAvailable from './updateAvailable'
import mapMouseCoordinates from './mapMouseCoordinates'
import datasetToDelete from './datasetToDelete'
import copyingBiotop from './copyingBiotop'
import user from './user'
import cloneTree2From1 from './cloneTree2From1'

export default merge(
  treeKey,
  exportKey,
  treeNodeLabelFilterKey,
  treeMap,
  urlQuery,
  login,
  moving,
  copying,
  updateAvailable,
  mapMouseCoordinates,
  datasetToDelete,
  copyingBiotop,
  user,
  cloneTree2From1
)
