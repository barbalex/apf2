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
}

export default Object.assign({}, exportDefaults, otherDefaults)
