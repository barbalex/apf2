// @flow
import merge from 'lodash/merge'

import treeActiveNodeArray from './treeActiveNodeArray'
import urlQuery from './urlQuery'
import login from './login'
import updateAvailable from './updateAvailable'
import mapMouseCoordinates from './mapMouseCoordinates'
import copyingBiotop from './copyingBiotop'
import user from './user'

export default merge(
  treeActiveNodeArray,
  urlQuery,
  login,
  updateAvailable,
  mapMouseCoordinates,
  copyingBiotop,
  user,
)
