// @flow
import gql from 'graphql-tag'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'

export default {
  Mutation: {
    addDatasetDeleted: (_, { datasetDeleted }, { cache }) => {
      const data = cache.readQuery({
        query: gql`
            query Query {
              datasetsDeleted @client
            }
          `
      })
      const datasetsDeleted = get(data, 'datasetsDeleted')
      datasetsDeleted.unshift(datasetDeleted)
      cache.writeData({
        data: {
          datasetsDeleted
        }
      })
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
