// @flow
import get from 'lodash/get'
import jwtDecode from 'jwt-decode'

import treeNodeLabelFilter from './tree/nodeLabelFilter'
import treeMap from './tree/map'

export default async idb => {
  // fetch user from idb
  const users = await idb.currentUser.toArray()
  const token = get(users, '[0].token', null)
  const tokenDecoded = token ? jwtDecode(token) : null
  const userIsFreiw =
    tokenDecoded &&
    tokenDecoded.role &&
    tokenDecoded.role === 'apflora_freiwillig'
  const view = userIsFreiw ? 'ekf' : 'normal'
  // substract 3 Months to now so user sees previous year in February
  const ekfRefDate = new Date().setMonth(new Date().getMonth() - 2)
  const ekfYear = new Date(ekfRefDate).getFullYear()

  const defaults = {
    updateAvailable: false,
    isPrint: false,
    view,
    ekfYear,
    ekfAdresseId,
    tree: {
      name: 'tree',
      activeNodeArray: [],
      openNodes: [],
      apFilter: false,
      nodeLabelFilter: treeNodeLabelFilter,
      map: treeMap,
      __typename: 'Tree',
    },
    tree2: {
      name: 'tree2',
      activeNodeArray: [],
      openNodes: [],
      apFilter: false,
      nodeLabelFilter: treeNodeLabelFilter,
      map: treeMap,
      __typename: 'Tree2',
    },
    /**
     * urlQueries are used to control tabs
     * for instance: Entwicklung or Biotop in tpopfeldkontr
     */
    urlQuery: {
      projekteTabs: ['tree', 'daten'],
      feldkontrTab: 'entwicklung',
      __typename: 'UrlQuery',
    },
    assigningBeob: false,
    mapMouseCoordinates: {
      x: 2683000,
      y: 1247500,
      __typename: 'MapMouseCoordinates',
    },
    copyingBiotop: {
      // gql needs an id
      id: 'copyingBiotop',
      label: null,
      __typename: 'CopyingBiotop',
    },
    login: {
      token: '',
      username: '',
      __typename: 'Login',
    },
    user: {
      name: get(users, '[0].name', ''),
      token,
      __typename: 'User',
    },
    export: {
      applyMapFilterToExport: false,
      fileType: 'xlsx',
      __typename: 'Export',
    },
    moving: {
      table: null,
      id: null,
      label: null,
      __typename: 'Moving',
    },
    copying: {
      table: null,
      id: null,
      label: null,
      withNextLevel: false,
      __typename: 'Copying',
    },
  }
  return defaults
}
