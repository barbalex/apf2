// @flow
import gql from "graphql-tag"
import get from 'lodash/get'

export default ({
  client,
  key,
  value
}:{
  client: Object,
  key: String,
  value: String
}): void => {
  const { data } = client.query({
    query: gql`
        query Query {
          urlQuery @client {
            projekteTabs
            feldkontrTab
          }
        }
      `
  })
  let projekteTabs = get(data, 'urlQuery.projekteTabs', [])
  let feldkontrTab = get(data, 'urlQuery.feldkontrTab', [])
  console.log('setUrlQueryValues:', { data, projekteTabs, feldkontrTab })
  if (key === 'projekteTabs') {
    projekteTabs = value
  } else {
    feldkontrTab = value
  }
  client.mutate({
    mutation: gql`
      mutation setUrlQuery($projekteTabs: Array!, $feldkontrTab: String!) {
        setUrlQuery(projekteTabs: $projekteTabs, feldkontrTab: $feldkontrTab) @client {
          projekteTabs
          feldkontrTab
        }
      }
    `,
    variables: { projekteTabs, feldkontrTab }
  })
}
