// @flow
export const exportDefaults = {
  updateAvailable: false
}

const otherDefaults = {
  activeNodeArray: [],
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
    name: null,
    // TODO: add freiwillig, computed from role
    // give token a temporary value to prevent login form from opening
    // before login has been fetched
    token: 'none',
    __typename: 'User'
  }
}

export default Object.assign({}, exportDefaults, otherDefaults)
