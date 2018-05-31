// @flow
import gql from 'graphql-tag'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'

export default {
  Mutation: {
    addDatasetDeleted: (_, { datasetDeleted }, { cache }) => {
      console.log('resolvers, addDatasetDeleted: datasetDeleted:', datasetDeleted)
      const data = cache.readQuery({
        query: gql`
            query Query {
              datasetsDeleted @client
            }
          `
      })
      const datasetsDeleted = [...get(data, 'datasetsDeleted')]
      console.log('resolvers, addDatasetDeleted, datasetsDeleted:', [...datasetsDeleted])
      datasetsDeleted.unshift(datasetDeleted)
      console.log('resolvers, addDatasetDeleted, datasetsDeleted after adding:', [...datasetsDeleted])
      cache.writeData({
        data: {
          datasetsDeleted
        }
      })
      console.log('resolvers, addDatasetDeleted: written data to cache')
      return null
    },
    removeDatasetDeleted: (_, { datasetDeleted }, { cache }) => {
      const data = cache.readQuery({
        query: gql`
            query Query {
              datasetsDeleted @client
            }
          `
      })
      let datasetsDeleted = get(data, 'datasetsDeleted')
      datasetsDeleted = datasetsDeleted.filter(d => !isEqual(d, datasetDeleted))
      cache.writeData({
        data: {
          datasetsDeleted
        }
      })
      return null
    },
  },
}
