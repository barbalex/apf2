import { gql } from '@apollo/client'

export const createTpopkontrzaehlEinheitWertesQuery = ({
  tpopkontrzaehlEinheitWerteGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: [
    'treeTpopkontrzaehlEinheitWerte',
    tpopkontrzaehlEinheitWerteGqlFilterForTree,
  ],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeTpopkontrzaehlEinheitWertesQuery(
          $filter: TpopkontrzaehlEinheitWerteFilter!
        ) {
          allTpopkontrzaehlEinheitWertes(
            filter: $filter
            orderBy: [SORT_ASC, TEXT_ASC]
          ) {
            nodes {
              id
              label
            }
          }
          totalCount: allTpopkontrzaehlEinheitWertes {
            totalCount
          }
        }
      `,
      variables: {
        filter: tpopkontrzaehlEinheitWerteGqlFilterForTree,
      },
      fetchPolicy: 'no-cache',
    }),
})
