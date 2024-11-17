import { gql } from '@apollo/client'

export const createTpopmassnbersQuery = ({
  tpopId,
  tpopmassnberGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeTpopmassnber', tpopId, tpopmassnberGqlFilterForTree],
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
              orderBy: [JAHR_ASC, DATUM_ASC]
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
