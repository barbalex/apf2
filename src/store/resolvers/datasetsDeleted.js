// @flow
import gql from 'graphql-tag'
import get from 'lodash/get'

export default {
  Mutation: {
    createDatasetDeleted: (_, { table, id, label, url, data, time }, { cache }) => {
      const previousDD = cache.readQuery({
        query: gql`
            query Query {
              datasetsDeleted @client
            }
          `
      })
      const previousDatasetsDeleted = get(previousDD, 'datasetsDeleted', [])
        .map(d => JSON.parse(d))
      const datasetsDeleted = [
        ...previousDatasetsDeleted,
        {
          table,
          id,
          label,
          url,
          data,
          time,
        }
      ].map(d => JSON.stringify(d))
      cache.writeData({
        data: {
          datasetsDeleted
        }
      })
      return null
    },
    deleteDatasetDeletedById: (_, { id }, { cache }) => {
      const previousDD = cache.readQuery({
        query: gql`
            query Query {
              datasetsDeleted @client
            }
          `
      })
      const previousDatasetsDeleted = get(previousDD, 'datasetsDeleted', [])
        .map(d => JSON.parse(d))
      const datasetsDeleted = previousDatasetsDeleted
        .filter(d => d.id !== id)
        .map(d => JSON.stringify(d))
      cache.writeData({
        data: {
          datasetsDeleted
        }
      })
      return null
    },
  },
}
