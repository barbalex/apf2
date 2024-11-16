import { gql } from '@apollo/client'

export const createApsQuery = ({
  projektId,
  apGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treeAp', projektId, apGqlFilterForTree],
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
        projId: projektId,
      },
      fetchPolicy: 'no-cache',
    }),
})
