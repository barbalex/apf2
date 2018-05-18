// @flow

import app from 'ampersand-app'
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import gql from 'graphql-tag'

export default {
  Mutation: {
    setTreeActiveNodeArray: (_, { value }, { cache }) => {
      const data = cache.readQuery({
        query: gql`
            query Query {
              tree @client {
                name
                activeNodeArray
                activeNodes
                activeDataset
                openNodes
                apFilter
                nodeLabelFilter
              }
            }
          `
      })
      const activeNodeArray = get(data, 'tree.activeNodeArray')
      // only write if changed
      if (!isEqual(activeNodeArray, value)) {
        cache.writeData({
          data: {
            tree: {
              name: get(data, 'name', null),
              activeNodeArray: value,
              activeNodes: get(data, 'activeNodes', null),
              activeDataset: get(data, 'activeDataset', null),
              openNodes: get(data, 'openNodes', null),
              apFilter: get(data, 'apFilter', null),
              nodeLabelFilter: get(data, 'nodeLabelFilter', null),
              __typename: 'Tree'
            }
          } 
        })
        app.history.push(`/${value.join('/')}`)
      }
      return null
    },
  },
}
