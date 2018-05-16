// @flow
export default {
  Mutation: {
    setMapMouseCoordinates: (_, { x, y }, { cache }) => {
      const mapMouseCoordinates = { x, y, __typename: 'MapMouseCoordinates' }
      cache.writeData({ data: { mapMouseCoordinates }})
      return null
    },
  },
}
