// @flow

import nodeLabelFilter from './tree/nodeLabelFilter'
import treeMap from './tree/map'

export default {
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
  login: {
    token: '',
    username: '',
    __typename: 'Login',
  },
}
