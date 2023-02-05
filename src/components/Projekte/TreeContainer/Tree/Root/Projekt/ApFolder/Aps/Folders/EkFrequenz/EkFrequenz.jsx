import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../Row'
import storeContext from '../../../../../../../../../../storeContext'

const EkFrequenz = ({ projekt, ap }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree

  const ekfrequenzsFilter = { apId: { equalTo: ap.id } }
  if (nodeLabelFilter.ekfrequenz) {
    ekfrequenzsFilter.label = {
      includesInsensitive: nodeLabelFilter.ekfrequenz,
    }
  }

  const { data } = useQuery({
    queryKey: ['treeEkfrequenz', ap.id, ekfrequenzsFilter],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeEkfrequenzQuery(
            $apId: UUID!
            $ekfrequenzsFilter: EkfrequenzFilter!
          ) {
            apById(id: $apId) {
              id
              ekfrequenzsByApId(filter: $ekfrequenzsFilter, orderBy: SORT_ASC) {
                nodes {
                  id
                  code
                }
              }
            }
          }
        `,
        variables: {
          apId: ap.id,
          ekfrequenzsFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  return (data?.data?.apById?.ekfrequenzsByApId?.nodes ?? []).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'ekfrequenz',
      id: el.id,
      parentId: ap.id,
      parentTableId: ap.id,
      urlLabel: el.id,
      label: el.code || '(kein Code)',
      url: ['Projekte', projekt.id, 'Arten', ap.id, 'EK-Frequenzen', el.id],
      hasChildren: false,
    }

    return <Row key={el.id} node={node} />
  })
}

export default observer(EkFrequenz)
