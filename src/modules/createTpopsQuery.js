import { gql } from '@apollo/client'

export const createTpopsQuery = ({
  popId,
  tpopGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeTpop', popId, tpopGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeTpopQuery($popId: UUID!, $tpopsFilter: TpopFilter!) {
          popById(id: $popId) {
            id
            tpopsByPopId(
              filter: $tpopsFilter
              orderBy: [NR_ASC, FLURNAME_ASC]
            ) {
              totalCount
              nodes {
                id
                label
                status
              }
            }
            tpopsCount: tpopsByPopId {
              totalCount
            }
          }
        }
      `,
      variables: {
        tpopsFilter: tpopGqlFilterForTree,
        popId,
      },
      fetchPolicy: 'no-cache',
    }),
})
