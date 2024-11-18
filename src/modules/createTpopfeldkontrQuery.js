import { gql } from '@apollo/client'

export const createTpopfeldkontrQuery = ({
  tpopId,
  ekGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeTpopfeldkontr', tpopId, ekGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeTpopfeldkontrsQuery(
          $tpopId: UUID!
          $tpopkontrsFilter: TpopkontrFilter!
        ) {
          tpopById(id: $tpopId) {
            id
            tpopfeldkontrs: tpopkontrsByTpopId(
              filter: $tpopkontrsFilter
              orderBy: [JAHR_ASC, DATUM_ASC]
            ) {
              nodes {
                id
                labelEk
              }
            }
            tpopfeldkontrsCount: tpopkontrsByTpopId(
              filter: { typ: { distinctFrom: "Freiwilligen-Erfolgskontrolle" } }
            ) {
              totalCount
            }
          }
        }
      `,
      variables: {
        tpopkontrsFilter: ekGqlFilterForTree,
        tpopId,
      },
      fetchPolicy: 'no-cache',
    }),
})
