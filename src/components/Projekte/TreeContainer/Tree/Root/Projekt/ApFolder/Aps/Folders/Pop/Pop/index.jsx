import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../storeContext.js'
import { PopFolders } from './Folders/index.jsx'

export const Pop = observer(({ projekt, ap }) => {
  const client = useApolloClient()
  const store = useContext(StoreContext)
  const { popGqlFilterForTree } = store.tree

  const { data } = useQuery({
    queryKey: ['treePop', ap.id, popGqlFilterForTree],
    queryFn: () =>
      client.query({
        query: gql`
          query TreePopQuery($apId: UUID!, $popsFilter: PopFilter!) {
            apById(id: $apId) {
              id
              popsByApId(filter: $popsFilter, orderBy: [NR_ASC, NAME_ASC]) {
                nodes {
                  id
                  label
                  status
                }
              }
            }
          }
        `,
        variables: {
          apId: ap.id,
          popsFilter: popGqlFilterForTree,
        },
        // without 'network-only' or using tanstack,
        // ui does not update when inserting and deleting
        fetchPolicy: 'no-cache',
      }),
  })

  return (data?.data?.apById?.popsByApId?.nodes ?? []).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'pop',
      id: el.id,
      parentId: `${ap.id}PopFolder`,
      parentTableId: ap.id,
      urlLabel: el.id,
      label: el.label,
      status: el.status,
      url: ['Projekte', projekt.id, 'Arten', ap.id, 'Populationen', el.id],
      hasChildren: true,
    }
    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 5 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'Populationen' &&
          n[5] === el.id,
      ).length > 0

    return (
      <div key={el.id}>
        <Row node={node} />
        {isOpen && (
          <PopFolders
            projekt={projekt}
            ap={ap}
            pop={el}
          />
        )}
      </div>
    )
  })
})
