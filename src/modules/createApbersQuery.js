import { gql } from '@apollo/client'

export const createApbersQuery = ({
  apId,
  apberGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeApber', apId, apberGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeApbersQuery(
          $apId: UUID!
          $apbersFilter: ApberFilter!
        ) {
          apById(id: $apId) {
            id
            apbersByApId(filter: $apbersFilter, orderBy: LABEL_ASC) {
              nodes {
                id
                label
              }
            }
            apbersCount: apbersByApId {
              totalCount
            }
          }
        }
      `,
      variables: {
        apbersFilter: apberGqlFilterForTree,
        apId,
      },
      fetchPolicy: 'no-cache',
    }),
})
