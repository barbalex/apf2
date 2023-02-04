import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import sortBy from 'lodash/sortBy'

import Row from '../../../../../../Row'
import storeContext from '../../../../../../../../../../storeContext'

const BeobNichtZuzuordnens = ({ projekt, ap }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { beobGqlFilterForTree } = store.tree
  const beobNichtZuzuordnensFilter = beobGqlFilterForTree('nichtZuzuordnen')

  const { data } = useQuery({
    queryKey: ['treeBeobNichtZuzuordnen', ap.id, beobNichtZuzuordnensFilter],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeBeobNichtZuzuordnensQuery(
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
                    beobsByArtId(
                      filter: $beobNichtZuzuordnensFilter
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
          beobNichtZuzuordnensFilter,
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
      menuType: 'beobNichtZuzuordnen',
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
        'nicht-zuzuordnende-Beobachtungen',
        el.id,
      ],
      hasChildren: false,
    }

    return <Row key={el.id} node={node} />
  })
}

export default observer(BeobNichtZuzuordnens)
