import { gql } from '@apollo/client'

export const createTpopbersQuery = ({
  tpopId,
  tpopberGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeTpopber', tpopId, tpopberGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeTpopbersQuery(
          $tpopId: UUID!
          $tpopbersFilter: TpopberFilter!
        ) {
          tpopById(id: $tpopId) {
            id
            tpopbersByTpopId(filter: $tpopbersFilter, orderBy: LABEL_ASC) {
              nodes {
                id
                label
              }
            }
            tpopbersCount: tpopbersByTpopId {
              totalCount
            }
          }
        }
      `,
      variables: {
        tpopbersFilter: tpopberGqlFilterForTree,
        tpopId,
      },
      fetchPolicy: 'no-cache',
    }),
})
