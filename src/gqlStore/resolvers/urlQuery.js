// @flow
import app from 'ampersand-app'
import isEqual from 'lodash/isEqual'
import queryString from 'query-string'
import gql from "graphql-tag"

export default {
  Mutation: {
    setUrlQuery: (_, { projekteTabs, feldkontrTab }, { cache }) => {
      const newUrlQuery = { projekteTabs, feldkontrTab }
      const { activeNodeArray } = cache.readQuery({
        query: gql`
            query Query {
              activeNodeArray @client
            }
          `
      })
      const { urlQuery } = cache.readQuery({
        query: gql`
            query Query {
              urlQuery @client {
                projekteTabs
                feldkontrTab
              }
            }
          `
      })
      // only write if changed
      if (!isEqual(urlQuery, newUrlQuery)) {
        cache.writeData({
          data: {
            urlQuery: {
              projekteTabs,
              feldkontrTab,
              __typename: 'UrlQuery'
            } 
          } 
        })
        const search = queryString.stringify(newUrlQuery)
        const query = `${Object.keys(newUrlQuery).length > 0 ? `?${search}` : ''}`
        app.history.push(`/${activeNodeArray.join('/')}${query}`)
      }
      return null
    },
  },
}
