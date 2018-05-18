// @flow
import gql from "graphql-tag"
import get from 'lodash/get'

export default async ({
  client,
  key,
  value
}:{
  client: Object,
  key: String,
  value: String
}): void => {
  const data = await client.query({
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
  let feldkontrTab = get(data, 'urlQuery.feldkontrTab', 'entwicklung')
  console.log('setUrlQueryValues:', { data, projekteTabs, feldkontrTab })
  if (key === 'projekteTabs') {
    projekteTabs = value
  } else {
    feldkontrTab = value
  }
  await client.mutate({
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
