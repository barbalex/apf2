import { gql } from '@apollo/client'

export const createPopsQuery = ({
  apId,
  popGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treePop', apId, popGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreePopQuery($apId: UUID!, $popsFilter: PopFilter!) {
          apById(id: $apId) {
            id
            popsByApId(filter: $popsFilter, orderBy: [NR_ASC, NAME_ASC]) {
              totalCount
              nodes {
                id
                label
                status
              }
            }
            popsCount: popsByApId {
              totalCount
            }
          }
        }
      `,
      variables: {
        popsFilter: popGqlFilterForTree,
        apId,
      },
      fetchPolicy: 'no-cache',
    }),
})
