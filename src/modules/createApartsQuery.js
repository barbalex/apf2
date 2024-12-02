import { gql } from '@apollo/client'

export const createApartsQuery = ({
  apId,
  apartGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeAparts', apId, apartGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeApartsQuery(
          $apId: UUID!
          $apartsFilter: ApartFilter!
        ) {
          apById(id: $apId) {
            id
            apartsByApId(filter: $apartsFilter, orderBy: LABEL_ASC) {
              nodes {
                id
                label
              }
            }
            apartsCount: apartsByApId {
              totalCount
            }
          }
        }
      `,
      variables: {
        apartsFilter: apartGqlFilterForTree,
        apId,
      },
      fetchPolicy: 'no-cache',
    }),
})
