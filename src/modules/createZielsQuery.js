import { gql } from '@apollo/client'

export const createZielsQuery = ({
  apId,
  zielGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeZiel', apId, zielGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeZielsQuery($apId: UUID!, $zielsFilter: ZielFilter!) {
          apById(id: $apId) {
            id
            zielsByApId(filter: $zielsFilter, orderBy: [JAHR_ASC, LABEL_ASC]) {
              nodes {
                id
                label
                jahr
              }
            }
            zielsCount: zielsByApId {
              totalCount
            }
          }
        }
      `,
      variables: {
        zielsFilter: zielGqlFilterForTree,
        apId,
      },
      fetchPolicy: 'no-cache',
    }),
})
