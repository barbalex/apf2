// @flow
/**
 * This resolver works for both trees
 * and all store keys of the tree
 */
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import uniqWith from 'lodash/uniqWith'
import gql from 'graphql-tag'
import queryString from 'query-string'

export default ({ history, mobxStore }) => ({
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
        `,
      })
      const oldValue = get(data, `${tree}.${key}`)
      const { urlQuery } = mobxStore
      // only write if changed
      if (!isEqual(oldValue, value)) {
        cache.writeData({
          data: {
            [tree]: {
              name: key === 'name' ? value : get(data, `${tree}.name`, null),
              activeNodeArray:
                key === 'activeNodeArray'
                  ? value
                  : get(data, `${tree}.activeNodeArray`, null),
              // openNodes: ensure every array exists only once
              openNodes:
                key === 'openNodes'
                  ? uniqWith(value, isEqual)
                  : get(data, `${tree}.openNodes`, null),
              apFilter:
                key === 'apFilter'
                  ? value
                  : get(data, `${tree}.apFilter`, null),
              __typename: tree === 'tree' ? 'Tree' : 'Tree2',
            },
          },
        })
        if (tree === 'tree' && key === 'activeNodeArray') {
          const search = queryString.stringify(urlQuery)
          const query = `${
            Object.keys(urlQuery).length > 0 ? `?${search}` : ''
          }`
          // pass openNodes as state
          history.push(`/${value.join('/')}${query}`, {
            openNodes: get(data, `${tree}.openNodes`),
          })
        }
      }
      return null
    },
  },
})
