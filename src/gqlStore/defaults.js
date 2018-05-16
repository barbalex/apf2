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
    id: 0,
    label: null,
    __typename: 'CopyingBiotop'
  }
}

export default Object.assign({}, exportDefaults, otherDefaults)
