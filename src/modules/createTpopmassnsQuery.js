import { gql } from '@apollo/client'

export const createTpopmassnsQuery = ({
  tpopId,
  tpopmassnGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeTpop', tpopId, tpopmassnGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeTpopQuery($tpopId: UUID!, $tpopmassnsFilter: TpopFilter!) {
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
            tpopmassnCount: tpopmassnsByTpopId {
              totalCount
            }
          }
        }
      `,
      variables: {
        tpopmassnsFilter: tpopGqlFilterForTree,
        tpopId,
      },
      fetchPolicy: 'no-cache',
    }),
})
