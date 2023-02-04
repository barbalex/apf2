import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import sortBy from 'lodash/sortBy'

import Row from '../../../../../../Row'
import storeContext from '../../../../../../../../../../storeContext'

const BeobNichtBeurteilts = ({ projekt, ap }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { beobGqlFilterForTree } = store.tree
  const beobNichtBeurteiltsFilter = beobGqlFilterForTree('nichtBeurteilt')

  const { data } = useQuery({
    queryKey: ['treeBeobNichtBeurteilt', ap.id, beobNichtBeurteiltsFilter],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeBeobNichtBeurteiltsQuery(
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
                    beobsByArtId(
                      filter: $beobNichtBeurteiltsFilter
                      orderBy: [DATUM_DESC, AUTOR_ASC]
                    ) {
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
          apId: ap.id,
          beobNichtBeurteiltsFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  // map through all elements and create array of nodes
  const aparts = data?.data?.apById?.apartsByApId?.nodes ?? []
  const nodesUnsorted = aparts.flatMap(
    (a) => a.aeTaxonomyByArtId?.beobsByArtId?.nodes ?? [],
  )
  // need to sort here instead of in query
  // because beob of multiple aparts are mixed
  const nodesSorted = sortBy(nodesUnsorted, 'label').reverse()

  return nodesSorted.map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'beobNichtBeurteilt',
      id: el.id,
      parentId: ap.id,
      parentTableId: ap.id,
      urlLabel: el.id,
      label: el.label,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'nicht-beurteilte-Beobachtungen',
        el.id,
      ],
      hasChildren: false,
    }

    return <Row key={el.id} node={node} />
  })
}

export default observer(BeobNichtBeurteilts)
