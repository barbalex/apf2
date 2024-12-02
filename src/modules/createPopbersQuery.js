import { gql } from '@apollo/client'

export const createPopbersQuery = ({
  popId,
  popberGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treePopbers', popId, popberGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreePopbersQuery(
          $popId: UUID!
          $popbersFilter: PopberFilter!
        ) {
          popById(id: $popId) {
            id
            popbersByPopId(filter: $popbersFilter, orderBy: LABEL_ASC) {
              nodes {
                id
                label
              }
            }
            popbersCount: popbersByPopId {
              totalCount
            }
          }
        }
      `,
      variables: {
        popbersFilter: popberGqlFilterForTree,
        popId,
      },
      fetchPolicy: 'no-cache',
    }),
})
