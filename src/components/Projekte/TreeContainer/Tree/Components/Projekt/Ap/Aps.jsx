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

  const nodes = aps.map((el) => ({
    nodeType: 'table',
    menuType: 'apberuebersicht',
    id: el.id,
    parentId: projekt.id,
    parentTableId: projekt.id,
    urlLabel: el.label || '(kein Jahr)',
    label: el.label,
    url: ['Projekte', projekt.id, 'AP-Berichte', el.id],
    hasChildren: false,
  }))

  return nodes.map((node) => <Row key={node.id} node={node} />)
}

export default Aps
