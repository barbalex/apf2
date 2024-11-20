import { gql } from '@apollo/client'

export const createEkAbrechnungstypWertesQuery = ({
  ekAbrechnungstypWerteGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: [
    'treeEkAbrechnungstypWerte',
    ekAbrechnungstypWerteGqlFilterForTree,
  ],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeEkAbrechnungstypWertesQuery(
          $filter: EkAbrechnungstypWerteFilter!
        ) {
          allEkAbrechnungstypWertes(
            filter: $filter
            orderBy: [SORT_ASC, TEXT_ASC]
          ) {
            nodes {
              id
              label
            }
          }
          totalCount: allEkAbrechnungstypWertes {
            totalCount
          }
        }
      `,
      variables: {
        filter: ekAbrechnungstypWerteGqlFilterForTree,
      },
      fetchPolicy: 'no-cache',
    }),
})
