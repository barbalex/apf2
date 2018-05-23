// @flow
/**
 * This resolver works for both trees
 */
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import clone from 'lodash/clone'
import upperFirst from 'lodash/upperFirst'
import gql from 'graphql-tag'

export default {
  Mutation: {
    setTreeMapKey: (_, { tree, key, value }, { cache }) => {
      const data = cache.readQuery({
        query: gql`
            query Query {
              tree @client {
                map {
                  detailplaene @client
                }
              }
              tree2 @client {
                map {
                  detailplaene @client
                }
              }
            }
          `
      })
      const oldValue = get(data, `${tree}.map.${key}`)
      // only write if changed
      if (!isEqual(oldValue, value)) {
        const oldMap = get(data, `${tree}.map`)
        const newMap = clone(oldMap)
        newMap[key] = value
        cache.writeData({
          data: {
            [tree]: {
              map: newMap,
              __typename: upperFirst(tree)
            }
          } 
        })
      }
      return null
    },
  },
}
