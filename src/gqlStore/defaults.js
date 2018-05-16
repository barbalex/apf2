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
  map: {
    panTo: {
      marker: null,
      x: null,
      y: null,
      __typename: 'PanTo'
    },
    __typename: 'Map'
  }
}

export default Object.assign({}, exportDefaults, otherDefaults)
