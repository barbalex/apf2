import { gql } from '@apollo/client'

export const createEkzaehleinheitsQuery = ({
  apId,
  ekzaehleinheitGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeEkzaehleinheit', apId, ekzaehleinheitGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeEkzaehleinheitsQuery(
          $apId: UUID!
          $ekzaehleinheitsFilter: EkzaehleinheitFilter!
        ) {
          apById(id: $apId) {
            id
            ekzaehleinheitsByApId(
              filter: $ekzaehleinheitsFilter
              orderBy: [SORT_ASC, LABEL_ASC]
            ) {
              nodes {
                id
                label
              }
            }
            ekzaehleinheitsCount: ekzaehleinheitsByApId {
              totalCount
            }
          }
        }
      `,
      variables: {
        ekzaehleinheitsFilter: ekzaehleinheitGqlFilterForTree,
        apId,
      },
      fetchPolicy: 'no-cache',
    }),
})
