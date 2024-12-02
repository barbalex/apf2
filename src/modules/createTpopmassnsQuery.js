import { gql } from '@apollo/client'

export const createTpopmassnsQuery = ({
  tpopId,
  tpopmassnGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeTpopmassns', tpopId, tpopmassnGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeTpopmassnsQuery(
          $tpopId: UUID!
          $tpopmassnsFilter: TpopmassnFilter!
        ) {
          tpopById(id: $tpopId) {
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
            tpopmassnsCount: tpopmassnsByTpopId {
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
