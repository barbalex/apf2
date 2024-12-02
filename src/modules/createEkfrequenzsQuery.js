import { gql } from '@apollo/client'

export const createEkfrequenzsQuery = ({
  apId,
  ekfrequenzGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeEkfrequenzs2', apId, ekfrequenzGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeEkfrequenzsQuery2(
          $apId: UUID!
          $ekfrequenzsFilter: EkfrequenzFilter!
        ) {
          apById(id: $apId) {
            id
            ekfrequenzsByApId(filter: $ekfrequenzsFilter, orderBy: SORT_ASC) {
              nodes {
                id
                code
                label: code
              }
            }
            ekfrequenzsCount: ekfrequenzsByApId {
              totalCount
            }
          }
        }
      `,
      variables: {
        ekfrequenzsFilter: ekfrequenzGqlFilterForTree,
        apId,
      },
      fetchPolicy: 'no-cache',
    }),
})
