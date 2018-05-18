// @flow

import app from 'ampersand-app'
import isEqual from 'lodash/isEqual'
import gql from 'graphql-tag'

export default {
  Mutation: {
    setActiveNodeArray: (_, { value }, { cache }) => {
      const { activeNodeArray } = cache.readQuery({
        query: gql`
            query Query {
              activeNodeArray @client
            }
          `
      })
      // only write if changed
      if (!isEqual(activeNodeArray, value)) {
        cache.writeData({
          data: {
            activeNodeArray: value
          } 
        })
        app.history.push(`/${value.join('/')}`)
      }
      return null
    },
  },
}
