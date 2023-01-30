import { gql } from '@apollo/client'
import { DateTime } from 'luxon'
import sortBy from 'lodash/sortBy'

const beobNichtBeurteiltNodes = async ({
  projId,
  apId,
  store,
  treeQueryVariables,
}) => {
  // TODO:
  // check label
  // order by
  const { data } = await store.client.query({
    query: gql`
      query TreeApQuery($apId: UUID!, $beobNichtBeurteiltsFilter: BeobFilter) {
        apById(id: $apId) {
          id
          apartsByApId {
            nodes {
              id
              aeTaxonomyByArtId {
                id
                beobsByArtId(
                  filter: $beobNichtBeurteiltsFilter
                  orderBy: DATUM_DESC
                ) {
                  nodes {
                    id
                    label
                    datum
                    autor
                    quelle
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
  const nodesSorted = sortBy(nodesUnsorted, [
    'datum',
    'autor',
    'quelle',
  ]).reverse()

  const nodes = nodesSorted.map((el) => {
    // somehow the label passed by the view gets corrupted when the node is active ????!!!
    // instead of '2010.07.02: Dickenmann Regula (EvAB 2016)' it gives: '2010.07.02: Dickenmann RegulaEvAB 2016)'
    // so need to build it here
    const datumIsValid = DateTime.fromSQL(el.datum).isValid
    const datum = datumIsValid
      ? DateTime.fromSQL(el.datum).toFormat('yyyy.LL.dd')
      : '(kein Datum)'
    const label = `${datum}: ${el?.autor ?? '(kein Autor)'} (${
      el?.quelle ?? 'keine Quelle'
    })`

    return {
      nodeType: 'table',
      menuType: 'beobNichtBeurteilt',
      filterTable: 'beob',
      id: el.id,
      parentId: apId,
      parentTableId: apId,
      urlLabel: el.id,
      label,
      url: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'nicht-beurteilte-Beobachtungen',
        el.id,
      ],
      hasChildren: false,
    }
  })

  return nodes
}

export default beobNichtBeurteiltNodes
