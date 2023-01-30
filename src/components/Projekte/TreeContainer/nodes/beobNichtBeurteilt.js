import { gql } from '@apollo/client'
import sortBy from 'lodash/sortBy'

const beobNichtBeurteiltNodes = async ({
  projId,
  apId,
  store,
  treeQueryVariables,
}) => {
  const { data } = await store.client.query({
    query: gql`
      query TreeBeobNichtBeurteiltQuery(
        $apId: UUID!
        $beobNichtBeurteiltsFilter: BeobFilter
      ) {
        apById(id: $apId) {
          id
          apartsByApId {
            nodes {
              id
              aeTaxonomyByArtId {
                id
                beobsByArtId(filter: $beobNichtBeurteiltsFilter) {
                  nodes {
                    id
                    label
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: {
      apId,
      beobNichtBeurteiltsFilter: treeQueryVariables.beobNichtBeurteiltsFilter,
    },
  })

  // map through all elements and create array of nodes
  const aparts = data?.apById?.apartsByApId?.nodes ?? []
  const nodesUnsorted = aparts.flatMap(
    (a) => a.aeTaxonomyByArtId?.beobsByArtId?.nodes ?? [],
  )
  // need to sort here instead of in query
  // because beob of multiple aparts are mixed
  const nodesSorted = sortBy(nodesUnsorted, 'label').reverse()

  const nodes = nodesSorted.map((el) => ({
    nodeType: 'table',
    menuType: 'beobNichtBeurteilt',
    filterTable: 'beob',
    id: el.id,
    parentId: apId,
    parentTableId: apId,
    urlLabel: el.id,
    label: el.label,
    url: [
      'Projekte',
      projId,
      'Arten',
      apId,
      'nicht-beurteilte-Beobachtungen',
      el.id,
    ],
    hasChildren: false,
  }))

  return nodes
}

export default beobNichtBeurteiltNodes
