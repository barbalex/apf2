// @flow
import merge from 'lodash/merge'

import buildTreeKey from './treeKey'
import exportKey from './exportKey'
import treeNodeLabelFilterKey from './treeNodeLabelFilterKey'
import treeNodeLabelFilter from './treeNodeLabelFilter'
import treeNodeLabelFilterResetExceptAp from './treeNodeLabelFilterResetExceptAp'
import treeMap from './treeMap'
import buildUrlQuery from './urlQuery'
import login from './login'
import moving from './moving'
import copying from './copying'
import updateAvailable from './updateAvailable'
import isPrint from './isPrint'
import ekfYear from './ekfYear'
import ekfAdresseId from './ekfAdresseId'
import view from './view'
import assigningBeob from './assigningBeob'
import mapMouseCoordinates from './mapMouseCoordinates'
import copyingBiotop from './copyingBiotop'
import user from './user'
import cloneTree2From1 from './cloneTree2From1'

export default ({ history }) => {
  const treeKey = buildTreeKey({ history })
  const urlQuery = buildUrlQuery({ history })
  const resolvers = merge(
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
    isPrint,
    ekfYear,
    ekfAdresseId,
    view,
    assigningBeob,
    mapMouseCoordinates,
    copyingBiotop,
    user,
    cloneTree2From1,
  )
  return resolvers
}
