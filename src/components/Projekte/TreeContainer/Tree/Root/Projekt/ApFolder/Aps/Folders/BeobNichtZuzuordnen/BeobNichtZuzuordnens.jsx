import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import sortBy from 'lodash/sortBy'

import { Row } from '../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../storeContext.js'

export const BeobNichtZuzuordnens = memo(
  observer(({ projekt, ap }) => {
    const client = useApolloClient()
    const store = useContext(StoreContext)
    const { beobNichtZuzuordnenGqlFilterForTree } = store.tree

    const { data } = useQuery({
      queryKey: [
        'treeBeobNichtZuzuordnen',
        ap.id,
        beobNichtZuzuordnenGqlFilterForTree,
      ],
      queryFn: () =>
        client.query({
          query: gql`
            query TreeBeobNichtZuzuordnensQuery(
              $apId: UUID!
              $filter: BeobFilter
            ) {
              apById(id: $apId) {
                id
                apartsByApId {
                  nodes {
                    id
                    aeTaxonomyByArtId {
                      id
                      beobsByArtId(
                        filter: $filter
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
            filter: beobNichtZuzuordnenGqlFilterForTree,
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

      return (
        <Row
          key={el.id}
          node={node}
        />
      )
    })
  }),
)
