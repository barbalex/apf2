import { useContext } from 'react'
import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import Row from '../../../../Row'
import storeContext from '../../../../../../../../storeContext'
import Folders from './Folders'

const Aps = ({ projekt }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
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

    const node = {
      nodeType: 'table',
      menuType: 'ap',
      id: ap.id,
      parentId: projekt.id,
      parentTableId: projekt.id,
      urlLabel: ap.id,
      label: ap.label,
      url: ['Projekte', projekt.id, 'Arten', ap.id],
      hasChildren: true,
    }

    return (
      <>
        <Row key={ap.id} node={node} />
        {isOpen && (
          <Folders key={`${ap.id}Folders`} ap={ap} projekt={projekt} />
        )}
      </>
    )
  })
}

export default observer(Aps)
