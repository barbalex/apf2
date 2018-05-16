// @flow
import query from '../../components/Projekte/Karte/CoordinatesControl/ShowCoordinates/data.graphql'

export default {
  Mutation: {
    setMapMouseCoordinates: (_, { x, y }, { cache }) => {
      console.log('mutation setMapMouseCoordinates running:', {x,y})
      const data = { mapMouseCoordinates: { x, y }}
      //cache.writeData({ id: 'MapMouseCoordinates', data })
      cache.writeQuery({ query, data })
      return null
    },
  },
}
