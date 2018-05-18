// @flow

import app from 'ampersand-app'
import isEqual from 'lodash/isEqual'
import queryString from 'query-string'
import gql from "graphql-tag"

export default {
  Mutation: {
    // do not manipulate url if store is not yet initiated?
    //if (!store.initiated) return
    setUrlQuery: (_, { projekteTabs, feldkontrTab }, { cache }) => {
      const urlQueryFromUrl = queryString.parse(window.location.search)
      const newUrlQuery = { projekteTabs, feldkontrTab }
      const { activeNodeArray } = cache.readQuery({
        query: gql`
            query AnaQuery {
              activeNodeArray @client
            }
          `
      })
      console.log('resolvers: urlQuery:', { urlQueryFromUrl, newUrlQuery, projekteTabs, feldkontrTab, activeNodeArray })
      if (!isEqual(urlQueryFromUrl, newUrlQuery)) {
        console.log('resolvers: urlQuery is not equal: writing to store and pushing to history')
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
