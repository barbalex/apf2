// @flow
import merge from 'lodash/merge'

import activeNodeArray from './activeNodeArray'
import urlQuery from './urlQuery'
import login from './login'
import updateAvailable from './updateAvailable'
import mapMouseCoordinates from './mapMouseCoordinates'
import copyingBiotop from './copyingBiotop'
import user from './user'
import storeInitiated from './storeInitiated'

export default merge(
  activeNodeArray,
  urlQuery,
  login,
  updateAvailable,
  mapMouseCoordinates,
  copyingBiotop,
  user,
  storeInitiated
)
