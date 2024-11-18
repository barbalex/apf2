import { gql } from '@apollo/client'

export const createBeobsQuery = ({
  tpopId,
  apId,
  beobGqlFilterForTree,
  apolloClient,
  type,
}) => {
  const gqlFilter = beobGqlFilterForTree(type)
  if (tpopId) {
    gqlFilter.tpopId = { equalTo: tpopId }
  }
  if (apId) {
    gqlFilter.apId = { equalTo: apId }
  }

  const totalCountFilter = { ...gqlFilter }
  delete totalCountFilter.label
  delete totalCountFilter.geomPoint

  const key0 =
    type === 'zugeordnet' ? 'treeBeobZugeordnet'
    : type === 'nichtBeurteilt' ? 'treeBeobNichtBeurteilt'
    : type === 'nichtZuzuordnen' ? 'treeBeobNichtZuzuordnen'
    : 'treeNoType'

  return {
    queryKey: [key0, tpopId, gqlFilter],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeBeobsQuery(
            $gqlFilter: BeobFilter!
            $totalCountFilter: BeobFilter!
          ) {
            allBeobs(filter: $gqlFilter, orderBy: [DATUM_DESC, AUTOR_ASC]) {
              nodes {
                id
                label
              }
            }
            beobsCount: allBeobs(filter: $totalCountFilter) {
              totalCount
            }
          }
        `,
        variables: { gqlFilter, totalCountFilter },
        // tanstack is caching
        fetchPolicy: 'no-cache',
      }),
  }
}
