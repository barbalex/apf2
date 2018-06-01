// @flow
import gql from 'graphql-tag'
import get from 'lodash/get'

export default {
  Mutation: {
    createError: (_, { error }, { cache }) => {
      // reinitialize db if db has problem
      // happens after refactoring db structure
      if (
        error &&
        error.includes('IDBDatabase') &&
        error.includes('One of the specified object stores was not found')
      ) {
        window.indexedDB.deleteDatabase('apflora')
        window.open(window.location.href, '_self')
        return
      }

      const data = cache.readQuery({
        query: gql`
            query Query {
              errors @client
            }
          `
      })
      const errors = get(data, 'errors', [])
        .map(d => JSON.parse(d))
      const newErrors = [
        ...errors,
        error
      ].map(d => JSON.stringify(d))
      cache.writeData({
        data: {
          errors: newErrors
        }
      })
      // pop after 10 seconds
      setTimeout(() => {
        const data = cache.readQuery({
          query: gql`
              query Query {
                errors @client
              }
            `
        })
        const errors = get(data, 'errors')
        errors.pop()
        cache.writeData({
          data: {
            errors
          }
        })
      }, 1000 * 10)
      return null
    },
  },
}
