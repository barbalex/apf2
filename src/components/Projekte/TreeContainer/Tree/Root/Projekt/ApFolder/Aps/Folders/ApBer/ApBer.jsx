import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../Row'
import storeContext from '../../../../../../../../../../storeContext'

const ApBer = ({ projekt, ap }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree

  const apbersFilter = { apId: { equalTo: ap.id } }
  if (nodeLabelFilter.apber) {
    apbersFilter.label = { includesInsensitive: nodeLabelFilter.apber }
  }

  const { data } = useQuery({
    queryKey: ['treeApber', ap.id, apbersFilter],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeApberQuery($apId: UUID!, $apbersFilter: ApberFilter!) {
            apById(id: $apId) {
              id
              apbersByApId(filter: $apbersFilter, orderBy: LABEL_ASC) {
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
          apbersFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  return (data?.data?.apById?.apbersByApId?.nodes ?? []).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'apber',
      id: el.id,
      parentId: ap.id,
      parentTableId: ap.id,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projekt.id, 'Arten', ap.id, 'AP-Berichte', el.id],
      hasChildren: false,
    }

    return <Row key={el.id} node={node} />
  })
}

export default observer(ApBer)
