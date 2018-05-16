// @flow
import merge from 'lodash/merge'

import activeNodeArray from './activeNodeArray'
import login from './login'
import updateAvailable from './updateAvailable'
import mapMouseCoordinates from './mapMouseCoordinates'
import mapPanTo from './mapPanTo'

export default merge(
  activeNodeArray,
  login,
  updateAvailable,
  mapMouseCoordinates,
  mapPanTo
)
