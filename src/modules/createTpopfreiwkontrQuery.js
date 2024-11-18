import { gql } from '@apollo/client'

export const createTpopfreiwkontrQuery = ({
  tpopId,
  ekfGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeTpopfreiwkontr', tpopId, ekfGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeTpopfreiwkontrsQuery(
          $tpopId: UUID!
          $tpopkontrsFilter: TpopkontrFilter!
        ) {
          tpopById(id: $tpopId) {
            id
            tpopfreiwkontrs: tpopkontrsByTpopId(
              filter: $tpopkontrsFilter
              orderBy: [JAHR_ASC, DATUM_ASC]
            ) {
              nodes {
                id
                labelEkf
              }
            }
            tpopfreiwkontrsCount: tpopkontrsByTpopId(
              filter: { typ: { equalTo: "Freiwilligen-Erfolgskontrolle" } }
            ) {
              totalCount
            }
          }
        }
      `,
      variables: {
        tpopkontrsFilter: ekfGqlFilterForTree,
        tpopId,
      },
      fetchPolicy: 'no-cache',
    }),
})
