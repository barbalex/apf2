// @flow

export default {
  Mutation: {
    setMapMouseCoordinates: (_, { x, y }, { cache }) => {
      const data = { x, y, __typename: 'MapMouseCoordinates' }
      cache.writeData({ data: { data } })
      return null
    },
  },
}
