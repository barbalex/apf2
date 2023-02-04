import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../Row'
import storeContext from '../../../../../../../../../../storeContext'

const ApArt = ({ projekt, ap }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree

  const apartsFilter = { apId: { equalTo: ap.id } }
  if (nodeLabelFilter.apart) {
    apartsFilter.label = { includesInsensitive: nodeLabelFilter.apart }
  }

  const { data } = useQuery({
    queryKey: ['treeApart', ap.id, apartsFilter],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeApartQuery($apId: UUID!, $apartsFilter: ApartFilter!) {
            apById(id: $apId) {
              id
              apartsByApId(filter: $apartsFilter, orderBy: LABEL_ASC) {
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
          apartsFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  return (data?.data?.apById?.apartsByApId?.nodes ?? []).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'apart',
      id: el.id,
      parentId: ap.id,
      parentTableId: ap.id,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projekt.id, 'Arten', ap.id, 'Taxa', el.id],
      hasChildren: false,
    }

    return <Row key={el.id} node={node} />
  })
}

export default observer(ApArt)
