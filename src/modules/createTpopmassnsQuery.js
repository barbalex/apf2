import { gql } from '@apollo/client'

export const createTpopmassnsQuery = ({
  tpopId,
  tpopmassnGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeTpopmassn', tpopId, tpopmassnGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeTpopQuery(
          $tpopId: UUID!
          $tpopmassnsFilter: TpopmassnFilter!
        ) {
          tpopById(id: $id) {
            id
            tpopmassnsByTpopId(
              filter: $tpopmassnsFilter
              orderBy: [JAHR_ASC, DATUM_ASC]
            ) {
              nodes {
                id
                label
              }
            }
            tpopmassnCount: tpopmassnsByTpopId(id: $tpopId) {
              totalCount
            }
          }
        }
      `,
      variables: {
        tpopmassnsFilter: tpopmassnGqlFilterForTree,
        tpopId,
      },
      fetchPolicy: 'no-cache',
    }),
})
