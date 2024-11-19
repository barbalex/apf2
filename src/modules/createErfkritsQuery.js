import { gql } from '@apollo/client'

export const createErfkritsQuery = ({
  apId,
  erfkritGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeErfkrit', apId, erfkritGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeErfkritsQuery($apId: UUID!, $erfkritsFilter: ErfkritFilter!) {
          apById(id: $apId) {
            id
            erfkritsByApId(
              filter: $erfkritsFilter
              orderBy: AP_ERFKRIT_WERTE_BY_ERFOLG__SORT_ASC
            ) {
              nodes {
                id
                label
              }
            }
            erfkritsCount: erfkritsByApId {
              totalCount
            }
          }
        }
      `,
      variables: {
        erfkritsFilter: erfkritGqlFilterForTree,
        apId,
      },
      fetchPolicy: 'no-cache',
    }),
})
