import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../storeContext.js'

export const AssozArt = memo(
  observer(({ projekt, ap }) => {
    const client = useApolloClient()
    const store = useContext(StoreContext)
    const { nodeLabelFilter } = store.tree

    const assozartFilter = { apId: { equalTo: ap.id } }
    if (nodeLabelFilter.assozart) {
      assozartFilter.label = {
        includesInsensitive: nodeLabelFilter.assozart,
      }
    }

    const { data } = useQuery({
      queryKey: ['treeAssozart', ap.id, assozartFilter],
      queryFn: () =>
        client.query({
          query: gql`
            query TreeAssozartQuery(
              $apId: UUID!
              $assozartFilter: AssozartFilter!
            ) {
              apById(id: $apId) {
                id
                assozartsByApId(filter: $assozartFilter, orderBy: LABEL_ASC) {
                  nodes {
                    id
                    label
                  }
                }
              }
            }
          `,
          variables: {
            apId: ap.id,
            assozartFilter,
          },
          fetchPolicy: 'no-cache',
        }),
    })

    return (data?.data?.apById?.assozartsByApId?.nodes ?? []).map((el) => {
      const node = {
        nodeType: 'table',
        menuType: 'assozart',
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
          'assoziierte-Arten',
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
