import { useContext } from 'react'
import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../storeContext.js'
import { ApFolders } from './Folders/index.jsx'

export const Aps = observer(({ projekt }) => {
  const client = useApolloClient()
  const store = useContext(StoreContext)
  const { openNodes, apGqlFilterForTree } = store.tree

  const { data } = useQuery({
    queryKey: ['treeAp', projekt.id, apGqlFilterForTree],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeApsQuery($apsFilter: ApFilter!) {
            allAps(filter: $apsFilter, orderBy: LABEL_ASC) {
              nodes {
                id
                label
              }
            }
          }
        `,
        variables: {
          apsFilter: apGqlFilterForTree,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const aps = data?.data?.allAps?.nodes ?? []

  return aps.map((ap) => {
    const isOpen =
      openNodes.filter(
        (n) =>
          n[0] === 'Projekte' &&
          n[1] === projekt.id &&
          n[2] === 'Arten' &&
          n[3] === ap.id,
      ).length > 0

    const url = ['Projekte', projekt.id, 'Arten', ap.id]

    const node = {
      nodeType: 'table',
      menuType: 'ap',
      id: ap.id,
      parentId: projekt.id,
      parentTableId: projekt.id,
      urlLabel: ap.id,
      label: ap.label,
      url,
      hasChildren: true,
    }

    return (
      <div key={ap.id}>
        <Row node={node} />
        {isOpen && (
          <ApFolders
            ap={ap}
            projekt={projekt}
          />
        )}
      </div>
    )
  })
})
