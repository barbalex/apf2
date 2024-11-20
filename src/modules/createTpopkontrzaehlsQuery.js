import { gql } from '@apollo/client'

export const createTpopkontrzaehlsQuery = ({
  tpopkontrId,
  tpopkontrzaehlGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: [
    'treeTpopfeldkontrzaehl',
    tpopkontrId,
    tpopkontrzaehlGqlFilterForTree,
  ],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeTpopkontrzaehlsQuery(
          $tpopkontrId: UUID!
          $tpopkontrzaehlsFilter: TpopkontrzaehlFilter!
        ) {
          tpopkontrById(id: $tpopkontrId) {
            id
            tpopkontrzaehlsByTpopkontrId(
              filter: $tpopkontrzaehlsFilter
              orderBy: LABEL_ASC
            ) {
              nodes {
                id
                label
              }
            }
            tpopkontrzaehlsCount: tpopkontrzaehlsByTpopkontrId {
              totalCount
            }
          }
        }
      `,
      variables: {
        tpopkontrzaehlsFilter: tpopkontrzaehlGqlFilterForTree,
        tpopkontrId,
      },
      fetchPolicy: 'no-cache',
    }),
})
