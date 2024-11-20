import { gql } from '@apollo/client'

export const createApberuebersichtsQuery = ({
  projId,
  apberuebersichtGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeApberuebersicht', projId, apberuebersichtGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeApberuebersichtsQuery($apberuebersichtsFilter: ApberuebersichtFilter!, $projId: UUID!) {
          allApberuebersichts(filter: $apberuebersichtsFilter, orderBy: LABEL_ASC) {
            nodes {
              id
              projId
              label
            }
          }
          totalCount: allApberuebersichts(filter: { projId: { equalTo: $projId } }) {
            totalCount
          }
        }
      `,
      variables: {
        apberuebersichtsFilter: apberuebersichtGqlFilterForTree,
        projId,
      },
      fetchPolicy: 'no-cache',
    }),
})
