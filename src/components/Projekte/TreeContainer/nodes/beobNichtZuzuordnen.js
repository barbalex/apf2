import { gql } from '@apollo/client'
import sortBy from 'lodash/sortBy'

const beobNichtZuzuordnenNodes = async ({
  projId,
  apId,
  store,
  treeQueryVariables,
}) => {
  const { data } = await store.client.query({
    query: gql`
      query TreeBeobNichtBeurteiltQuery(
        $apId: UUID!
        $beobNichtZuzuordnensFilter: BeobFilter
      ) {
        apById(id: $apId) {
          id
          apartsByApId {
            nodes {
              id
              aeTaxonomyByArtId {
                id
                beobsByArtId(filter: $beobNichtZuzuordnensFilter) {
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
      beobNichtZuzuordnensFilter: treeQueryVariables.beobNichtZuzuordnensFilter,
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

  // map through all elements and create array of nodes
  const nodes = nodesSorted.map((el) => ({
    nodeType: 'table',
    menuType: 'beobNichtZuzuordnen',
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
      'nicht-zuzuordnende-Beobachtungen',
      el.id,
    ],
    hasChildren: false,
  }))

  return nodes
}

export default beobNichtZuzuordnenNodes
