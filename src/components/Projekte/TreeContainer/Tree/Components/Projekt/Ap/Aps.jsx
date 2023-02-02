import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'

import Row from '../../../Row'
import storeContext from '../../../../../../../storeContext'

const Aps = ({ projekt }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)

  const { data } = useQuery({
    queryKey: ['treeAps', projekt.id, store.dataFilter?.ap, store.apFilter],
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
          apsFilter: store.tree.apGqlFilter.filtered,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const aps = data?.data?.allAps?.nodes ?? []

  const nodes = aps.map((ap) => ({
    nodeType: 'table',
    menuType: 'ap',
    id: ap.id,
    parentId: projekt.id,
    parentTableId: projekt.id,
    urlLabel: ap.id,
    label: ap.label,
    url: ['Projekte', projekt.id, 'Arten', ap.id],
    hasChildren: true,
  }))

  return nodes.map((node) => <Row key={node.id} node={node} />)
}

export default Aps
