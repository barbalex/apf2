import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { gql, useApolloClient } from '@apollo/client'

import Row from '../../../Row'
import storeContext from '../../../../../../../storeContext'

const EkAbrechnungstypNodes = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree

  const ekAbrechnungstypWertesFilter = nodeLabelFilter.ekAbrechnungstypWerte
    ? {
        label: { includesInsensitive: nodeLabelFilter.ekAbrechnungstypWerte },
      }
    : { id: { isNull: false } }

  const { data } = useQuery({
    queryKey: ['treeEkAbrechnungstypWerte', ekAbrechnungstypWertesFilter],
    queryFn: async () =>
      client.query({
        query: gql`
          query TreeEkAbrechnungstypWertesQuery(
            $ekAbrechnungstypWertesFilter: EkAbrechnungstypWerteFilter!
          ) {
            allEkAbrechnungstypWertes(
              filter: $ekAbrechnungstypWertesFilter
              orderBy: SORT_ASC
            ) {
              nodes {
                id
                label
              }
            }
          }
        `,
        variables: {
          ekAbrechnungstypWertesFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  const nodes = (data?.data?.allEkAbrechnungstypWertes?.nodes ?? []).map(
    (el) => ({
      nodeType: 'table',
      menuType: 'ekAbrechnungstypWerte',
      id: el.id,
      parentId: 'ekAbrechnungstypWerteFolder',
      urlLabel: el.id,
      label: el.label,
      url: ['Werte-Listen', 'EkAbrechnungstypWerte', el.id],
      hasChildren: false,
    }),
  )

  if (!nodes.length) return null

  return nodes.map((node) => <Row key={node.id} node={node} />)
}

export default EkAbrechnungstypNodes
