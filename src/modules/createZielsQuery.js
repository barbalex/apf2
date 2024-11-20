import { gql } from '@apollo/client'

export const createZielsQuery = ({
  apId,
  zielGqlFilterForTree,
  apolloClient,
  jahr,
}) => {
  const filter =
    jahr ?
      { ...zielGqlFilterForTree, jahr: { equalTo: +jahr } }
    : zielGqlFilterForTree
  const countFilter =
    jahr ? { jahr: { equalTo: +jahr } } : { id: { isNull: false } }

  return {
    queryKey: ['treeZiel', apId, zielGqlFilterForTree, jahr],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeZielsQuery(
            $apId: UUID!
            $filter: ZielFilter!
            $countFilter: ZielFilter!
          ) {
            apById(id: $apId) {
              id
              zielsByApId(filter: $filter, orderBy: [JAHR_ASC, LABEL_ASC]) {
                nodes {
                  id
                  label
                  jahr
                }
              }
              zielsCount: zielsByApId(filter: $countFilter) {
                totalCount
              }
            }
          }
        `,
        variables: {
          filter,
          countFilter,
          apId,
        },
        fetchPolicy: 'no-cache',
      }),
  }
}
