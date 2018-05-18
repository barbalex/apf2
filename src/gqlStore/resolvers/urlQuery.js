// @flow
import app from 'ampersand-app'
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import queryString from 'query-string'
import gql from "graphql-tag"

export default {
  Mutation: {
    setUrlQuery: (_, { projekteTabs, feldkontrTab }, { cache }) => {
      const newUrlQuery = { projekteTabs, feldkontrTab }
      const data = cache.readQuery({
        query: gql`
            query Query {
              tree @client {
                activeNodeArray
              }
              urlQuery @client {
                projekteTabs
                feldkontrTab
              }
            }
          `
      })
      const activeNodeArray = get(data, 'tree.activeNodeArray')
      const urlQuery = get(data, 'urlQuery')
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
