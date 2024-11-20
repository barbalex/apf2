import { gql } from '@apollo/client'

export const createTpopApberrelevantGrundWertesQuery = ({
  tpopApberrelevantGrundWerteGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: [
    'treeTpopApberrelevantGrundWerte',
    tpopApberrelevantGrundWerteGqlFilterForTree,
  ],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeTpopApberrelevantGrundWertesQuery(
          $filter: TpopApberrelevantGrundWerteFilter!
        ) {
          allTpopApberrelevantGrundWertes(
            filter: $filter
            orderBy: [SORT_ASC, TEXT_ASC]
          ) {
            nodes {
              id
              label
            }
          }
          totalCount: allTpopApberrelevantGrundWertes {
            totalCount
          }
        }
      `,
      variables: {
        filter: tpopApberrelevantGrundWerteGqlFilterForTree,
      },
      fetchPolicy: 'no-cache',
    }),
})
