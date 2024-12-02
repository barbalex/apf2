import { gql } from '@apollo/client'

export const createTpopmassnbersQuery = ({
  tpopId,
  tpopmassnberGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeTpopmassnbers', tpopId, tpopmassnberGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeTpopmassnbersQuery(
          $tpopId: UUID!
          $tpopmassnbersFilter: TpopmassnberFilter!
        ) {
          tpopById(id: $tpopId) {
            id
            tpopmassnbersByTpopId(
              filter: $tpopmassnbersFilter
              orderBy: [LABEL_ASC]
            ) {
              nodes {
                id
                label
              }
            }
            tpopmassnbersCount: tpopmassnbersByTpopId {
              totalCount
            }
          }
        }
      `,
      variables: {
        tpopmassnbersFilter: tpopmassnberGqlFilterForTree,
        tpopId,
      },
      fetchPolicy: 'no-cache',
    }),
})
