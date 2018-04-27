// @flow
import merge from 'lodash/merge'

import activeNodeArray from './activeNodeArray'
import login from './login'
import updateAvailable from './updateAvailable'

export default merge(activeNodeArray, login, updateAvailable)
