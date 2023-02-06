import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { gql, useApolloClient } from '@apollo/client'

import Row from '../../../Row'
import storeContext from '../../../../../../../storeContext'

const ZaehlEinheitNodes = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree

  const tpopkontrzaehlEinheitWertesFilter =
    nodeLabelFilter.tpopkontrzaehlEinheitWerte
      ? {
          label: {
            includesInsensitive: nodeLabelFilter.tpopkontrzaehlEinheitWerte,
          },
        }
      : { id: { isNull: false } }

  const { data } = useQuery({
    queryKey: [
      'treeTpopkontrzaehlEinheitWerte',
      tpopkontrzaehlEinheitWertesFilter,
    ],
    queryFn: async () =>
      client.query({
        query: gql`
          query TreeTpopkontrzaehlEinheitWertesQuery(
            $tpopkontrzaehlEinheitWertesFilter: TpopkontrzaehlEinheitWerteFilter!
          ) {
            allTpopkontrzaehlEinheitWertes(
              filter: $tpopkontrzaehlEinheitWertesFilter
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
          tpopkontrzaehlEinheitWertesFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  return (data?.data?.allTpopkontrzaehlEinheitWertes?.nodes ?? []).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'tpopkontrzaehlEinheitWerte',
      id: el.id,
      parentId: 'tpopkontrzaehlEinheitWerteFolder',
      urlLabel: el.id,
      label: el.label,
      url: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte', el.id],
      hasChildren: false,
    }

    return <Row key={el.id} node={node} />
  })
}

export default ZaehlEinheitNodes
