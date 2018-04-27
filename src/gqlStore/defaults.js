// @flow
export const exportDefaults = {
  updateAvailable: false,
}

const otherDefaults = {
  activeNodeArray: [],
  login: {
    token: '',
    username: '',
    __typename: 'Login',
  },
}

export default Object.assign({}, exportDefaults, otherDefaults)
