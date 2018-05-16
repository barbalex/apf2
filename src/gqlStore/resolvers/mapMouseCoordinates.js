// @flow
export default {
  Mutation: {
    setMapMouseCoordinates: (_, { x, y }, { cache }) => {
      cache.writeData({ data: {
        mapMouseCoordinates: {
          x,
          y,
          __typename: 'MapMouseCoordinates'
        }
      }})
      return null
    },
  },
}
