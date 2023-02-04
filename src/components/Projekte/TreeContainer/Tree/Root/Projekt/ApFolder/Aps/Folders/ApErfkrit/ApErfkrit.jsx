import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../Row'
import storeContext from '../../../../../../../../../../storeContext'

const ApErfkrit = ({ projekt, ap }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree

  const erfkritsFilter = { apId: { equalTo: ap.id } }
  if (nodeLabelFilter.erfkrit) {
    erfkritsFilter.label = {
      includesInsensitive: nodeLabelFilter.erfkrit,
    }
  }

  const { data } = useQuery({
    queryKey: ['treeErfkrit', ap.id, erfkritsFilter],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeErfkritQuery(
            $apId: UUID!
            $erfkritsFilter: ErfkritFilter!
          ) {
            apById(id: $apId) {
              id
              erfkritsByApId(
                filter: $erfkritsFilter
                orderBy: AP_ERFKRIT_WERTE_BY_ERFOLG__SORT_ASC
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
          erfkritsFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  return (data?.data?.apById?.erfkritsByApId?.nodes ?? []).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'erfkrit',
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
        'AP-Erfolgskriterien',
        el.id,
      ],
      hasChildren: false,
    }

    return <Row key={el.id} node={node} />
  })
}

export default observer(ApErfkrit)
