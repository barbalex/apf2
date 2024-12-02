import { gql } from '@apollo/client'

export const createZielbersQuery = ({
  zielId,
  zielberGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeZielbers', zielId, zielberGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeZielbersQuery($zielId: UUID!, $filter: ZielberFilter!) {
          zielById(id: $zielId) {
            id
            zielbersByZielId(filter: $filter, orderBy: LABEL_ASC) {
              nodes {
                id
                label
              }
            }
            zielbersCount: zielbersByZielId {
              totalCount
            }
          }
        }
      `,
      variables: {
        filter: zielberGqlFilterForTree,
        zielId,
      },
      fetchPolicy: 'no-cache',
    }),
})
