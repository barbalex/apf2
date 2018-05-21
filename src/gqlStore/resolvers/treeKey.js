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
                openNodes
                apFilter
              }
              tree2 @client {
                name
                activeNodeArray
                openNodes
                apFilter
              }
            }
          `
      })
      const oldValue = get(data, `${tree}.${key}`)
      // only write if changed
      if (!isEqual(oldValue, value)) {
        cache.writeData({
          data: {
            [tree]: {
              name: key === 'name' ? value : get(data, `${tree}.name`, null),
              activeNodeArray: key === 'activeNodeArray' ? value : get(data, `${tree}.activeNodeArray`, null),
              openNodes: key === 'openNodes' ? value : get(data, `${tree}.openNodes`, null),
              apFilter: key === 'apFilter' ? value : get(data, `${tree}.apFilter`, null),
              __typename: tree === 'tree' ? 'Tree' : 'Tree2'
            }
          } 
        })
        if (tree === 'tree' && key === 'activeNodeArray') {
          app.history.push(`/${value.join('/')}`)
        }
      }
      return null
    },
  },
}
