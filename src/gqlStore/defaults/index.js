// @flow
import get from 'lodash/get'

import treeNodeLabelFilter from './tree/nodeLabelFilter'
import treeMap from './tree/map'

export default async (idb) => {

  // fetch user from idb
  const users = await idb.currentUser.toArray()
  
  const defaults = {
    updateAvailable: false,
    tree: {
      name: 'tree',
      activeNodeArray: [],
      openNodes: [],
      apFilter: false,
      nodeLabelFilter: treeNodeLabelFilter,
      map: treeMap,
      __typename: 'Tree'
    },
    tree2: {
      name: 'tree2',
      activeNodeArray: [],
      openNodes: [],
      apFilter: false,
      nodeLabelFilter: treeNodeLabelFilter,
      map: treeMap,
      __typename: 'Tree2'
    },
    /**
     * urlQueries are used to control tabs
     * for instance: Entwicklung or Biotop in tpopfeldkontr
     */
    urlQuery: {
      projekteTabs: ['tree', 'daten'],
      feldkontrTab: 'entwicklung',
      __typename: 'UrlQuery'
    },
    login: {
      token: '',
      username: '',
      __typename: 'Login',
    },
    mapMouseCoordinates: {
      x: 2683000,
      y: 1247500,
      __typename: 'MapMouseCoordinates',
    },
    copyingBiotop: {
      // gql needs an id
      id: 'copyingBiotop',
      label: null,
      __typename: 'CopyingBiotop'
    },
    user: {
      // gql needs an id?
      name: get(users, '[0].name', null),
      // TODO: add freiwillig, computed from role
      // give token a temporary value to prevent login form from opening
      // before login has been fetched
      token: get(users, '[0].token', null),
      __typename: 'User'
    },
    export: {
      applyMapFilterToExport: false,
      fileType: 'xlsx',
      __typename: 'Export'
    },
    moving: {
      table: null,
      id: null,
      label: null,
    }
  }
  return defaults
}
