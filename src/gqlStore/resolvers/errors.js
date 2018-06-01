// @flow
import gql from 'graphql-tag'
import get from 'lodash/get'

export default {
  Mutation: {
    addError: (_, { error }, { cache }) => {
      // reinitialize db if db has problem
      // happens after refactoring db structure
      if (
        error &&
        error.message &&
        error.message.includes('IDBDatabase') &&
        error.message.includes('One of the specified object stores was not found')
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
      const newErrors = [
        ...errors,
        error,
      ]
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
        const newErrors = [ ...errors ]
        newErrors.pop()
        cache.writeData({
          data: {
            errors: newErrors
          }
        })
      }, 1000 * 10)
      return null
    },
  },
}
