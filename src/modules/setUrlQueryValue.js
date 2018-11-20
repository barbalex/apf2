// @flow
import gql from 'graphql-tag'
import get from 'lodash/get'

export default async ({
  key,
  value,
  client,
}: {
  key: String,
  value: String,
  client: Object,
}): void => {
  const { data } = await client.query({
    query: gql`
      query Query {
        urlQuery @client {
          projekteTabs
          feldkontrTab
        }
      }
    `,
  })
  let projekteTabs = get(data, 'urlQuery.projekteTabs')
  let feldkontrTab = get(data, 'urlQuery.feldkontrTab')
  if (key === 'projekteTabs') {
    projekteTabs = value
  } else {
    feldkontrTab = value
  }
  await client.mutate({
    mutation: gql`
      mutation setUrlQuery($projekteTabs: Array!, $feldkontrTab: String!) {
        setUrlQuery(projekteTabs: $projekteTabs, feldkontrTab: $feldkontrTab)
          @client {
          projekteTabs
          feldkontrTab
        }
      }
    `,
    variables: { projekteTabs, feldkontrTab },
  })
}
