import { gql } from '@apollo/client'

export const createPopmassnbersQuery = ({
  popId,
  popmassnberGqlFilterForTree,
  apolloClient,
}) => ({
  queryKey: ['treePopmassnber', popId, popmassnberGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreePopmassnbersQuery(
          $popId: UUID!
          $popmassnbersFilter: PopmassnberFilter!
        ) {
          popById(id: $popId) {
            id
            popmassnbersByPopId(
              filter: $popmassnbersFilter
              orderBy: LABEL_ASC
            ) {
              nodes {
                id
                label
              }
            }
            popmassnbersCount: popmassnbersByPopId {
              totalCount
            }
          }
        }
      `,
      variables: {
        popmassnbersFilter: popmassnberGqlFilterForTree,
        popId,
      },
      fetchPolicy: 'no-cache',
    }),
})
