// @flow
import jwtDecode from 'jwt-decode'

import nodeLabelFilter from './tree/nodeLabelFilter'
import treeMap from './tree/map'

export default async mobxStore => {
  // fetch user from idb
  const { user } = mobxStore
  const { token } = user
  const tokenDecoded = token ? jwtDecode(token) : null
  const userIsFreiw =
    tokenDecoded &&
    tokenDecoded.role &&
    tokenDecoded.role === 'apflora_freiwillig'
  const view = userIsFreiw ? 'ekf' : 'normal'
  //console.log('store, defaults, set view to:', view)
  // substract 3 Months to now so user sees previous year in February
  const ekfRefDate = new Date().setMonth(new Date().getMonth() - 2)
  const ekfYear = new Date(ekfRefDate).getFullYear()

  const defaults = {
    view,
    ekfYear,
    ekfAdresseId: null,
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
