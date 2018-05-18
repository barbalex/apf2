// @flow
import get from 'lodash/get'

export default async (idb) => {
  const exportDefaults = {
    updateAvailable: false
  }
  
  // fetch user from idb
  const users = await idb.currentUser.toArray()
  
  const otherDefaults = {
    storeInitiated: false,
    activeNodeArray: [],
    /**
     * urlQueries are used to control tabs
     * for instance: Entwicklung or Biotop in tpopfeldkontr
     */
    urlQuery: {
      projekteTabs: [],
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
    }
  }
  console.log('store defaults setting')
  return Object.assign({}, exportDefaults, otherDefaults)
}
