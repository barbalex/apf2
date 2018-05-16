// @flow
export default {
  Mutation: {
    setMapPanTo: (_, { x, y, marker }, { cache }) => {
      cache.writeData({ data: {
        map: {
          panTo: {
            marker,
            x,
            y,
            __typename: 'PanTo'
          },
          __typename: 'Map'
        }
      }})
      return null
    },
  },
}
