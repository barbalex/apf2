// @flow
import gql from 'graphql-tag'
import get from 'lodash/get'

export default {
  Mutation: {
    createDatasetDeleted: (_, { table, id, label, url, data, time }, { cache }) => {
      console.log('resolvers, createDatasetDeleted: datasetDeleted:', { table, id, label, url, data })
      const previousDatasetsDeleted = cache.readQuery({
        query: gql`
            query Query {
              datasetsDeleted @client
            }
          `
      })
      const datasetsDeleted = [...get(previousDatasetsDeleted, 'datasetsDeleted')]
      console.log('resolvers, createDatasetDeleted, datasetsDeleted:', [...datasetsDeleted])
      
      const newDatasetDeleted = {
        table,
        id,
        label,
        url,
        data,
        time,
        __typename: 'DatasetDeleted'
      }
      datasetsDeleted.unshift(newDatasetDeleted)
      console.log('resolvers, createDatasetDeleted, datasetsDeleted after adding:', [...datasetsDeleted])
      cache.writeData({
        data: {
          datasetsDeleted
        }
      })
      console.log('resolvers, createDatasetDeleted: written data to cache')
      return null
    },
    deleteDatasetDeletedById: (_, { id }, { cache }) => {
      const data = cache.readQuery({
        query: gql`
            query Query {
              datasetsDeleted @client
            }
          `
      })
      let datasetsDeleted = get(data, 'datasetsDeleted')
      datasetsDeleted = datasetsDeleted.filter(d => d.id !== id)
      cache.writeData({
        data: {
          datasetsDeleted
        }
      })
      return null
    },
  },
}
