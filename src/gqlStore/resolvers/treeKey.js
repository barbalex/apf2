// @flow
/**
 * This resolver works for both trees
 * and all store keys of the tree
 */
import app from 'ampersand-app'
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import gql from 'graphql-tag'

export default {
  Mutation: {
    setTreeKey: (_, { tree, key, value }, { cache }) => {
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
              tree2 @client {
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
            [tree]: {
              name: key === 'name' ? value : get(data, `${tree}.name`, null),
              activeNodeArray: key === 'activeNodeArray' ? value : get(data, `${tree}.activeNodeArray`, null),
              activeNodes: key === 'activeNodes' ? value : get(data, `${tree}.activeNodes`, null),
              activeDataset: key === 'activeDataset' ? value : get(data, `${tree}.activeDataset`, null),
              openNodes: key === 'openNodes' ? value : get(data, `${tree}.openNodes`, null),
              apFilter: key === 'apFilter' ? value : get(data, `${tree}.apFilter`, null),
              nodeLabelFilter: key === 'nodeLabelFilter' ? value : get(data, `${tree}.nodeLabelFilter`, null),
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
