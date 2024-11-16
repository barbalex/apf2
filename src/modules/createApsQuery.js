import { gql } from '@apollo/client'

export const createApsQuery = ({
  projId,
  apGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeAp', projId, apGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeApsQuery($apsFilter: ApFilter!, $projId: UUID!) {
          allAps(filter: $apsFilter, orderBy: LABEL_ASC) {
            nodes {
              id
              label
            }
          }
          totalCount: allAps(filter: { projId: { equalTo: $projId } }) {
            totalCount
          }
        }
      `,
      variables: {
        apsFilter: apGqlFilterForTree,
        projId,
      },
      fetchPolicy: 'no-cache',
    }),
})
