import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../Row'
import storeContext from '../../../../../../../../../../storeContext'

const EkZaehleinheits = ({ projekt, ap }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree

  const ekzaehleinheitsFilter = { apId: { equalTo: ap.id } }
  if (nodeLabelFilter.ekzaehleinheit) {
    ekzaehleinheitsFilter.label = {
      includesInsensitive: nodeLabelFilter.ekzaehleinheit,
    }
  }

  const { data } = useQuery({
    queryKey: ['treeEkzaehleinheit', ap.id, ekzaehleinheitsFilter],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeEkzaehleinheitQuery(
            $apId: UUID!
            $ekzaehleinheitsFilter: EkzaehleinheitFilter!
          ) {
            apById(id: $apId) {
              id
              ekzaehleinheitsByApId(
                filter: $ekzaehleinheitsFilter
                orderBy: [SORT_ASC, LABEL_ASC]
              ) {
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
          ekzaehleinheitsFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  return (data?.data?.apById?.ekzaehleinheitsByApId?.nodes ?? []).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'ekzaehleinheit',
      id: el.id,
      parentId: ap.id,
      parentTableId: ap.id,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projekt.id, 'Arten', ap.id, 'EK-Zähleinheiten', el.id],
      hasChildren: false,
    }

    return <Row key={el.id} node={node} />
  })
}

export default observer(EkZaehleinheits)
