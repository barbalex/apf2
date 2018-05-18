// @flow

import app from 'ampersand-app'
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import gql from 'graphql-tag'

export default {
  Mutation: {
    setTreeActiveNodeArray: (_, { value }, { cache }) => {
      console.log('resolvers: treeActiveNodeArray, value:', value)
      const data = cache.readQuery({
        query: gql`
            query Query {
              tree @client {
                activeNodeArray
              }
            }
          `
      })
      const activeNodeArray = get(data, 'tree.activeNodeArray')
      console.log('resolvers: treeActiveNodeArray, 2:', {data,activeNodeArray})
      // only write if changed
      if (!isEqual(activeNodeArray, value)) {
        console.log('resolvers: treeActiveNodeArray, will 3:')
        cache.writeFragment({
          id: 'tree',
          fragment: gql`
            fragment myTree on Tree {
              activeNodeArray
            }
          `,
          data: {
            activeNodeArray
          }
        })
        /*
        cache.writeData({
          data: {
            tree: {
              activeNodeArray: value,
              __typename: 'Tree'
            }
          } 
        })*/
        console.log('resolvers: treeActiveNodeArray, 3:')
        app.history.push(`/${value.join('/')}`)
      }
      return null
    },
  },
}
