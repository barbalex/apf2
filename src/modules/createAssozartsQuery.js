import { gql } from '@apollo/client'

export const createAssozartsQuery = ({
  apId,
  assozartGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeAssozarts', apId, assozartGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeAssozartsQuery(
          $apId: UUID!
          $assozartsFilter: AssozartFilter!
        ) {
          apById(id: $apId) {
            id
            assozartsByApId(filter: $assozartsFilter, orderBy: LABEL_ASC) {
              nodes {
                id
                label
              }
            }
            assozartsCount: assozartsByApId {
              totalCount
            }
          }
        }
      `,
      variables: {
        assozartsFilter: assozartGqlFilterForTree,
        apId,
      },
      fetchPolicy: 'no-cache',
    }),
})
