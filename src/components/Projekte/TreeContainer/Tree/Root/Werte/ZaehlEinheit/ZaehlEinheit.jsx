import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { gql, useApolloClient } from '@apollo/client'

import { Row } from '../../../Row.jsx'
import { StoreContext } from '../../../../../../../storeContext.js'
import { createTpopkontrzaehlEinheitWertesQuery } from '../../../../../../../modules/createTpopkontrzaehlEinheitWertesQuery.js'

export const ZaehlEinheit = () => {
  const apolloClient = useApolloClient()
  const store = useContext(StoreContext)
  const { tpopkontrzaehlEinheitWerteGqlFilterForTree } = store.tree

  const { data } = useQuery(
    createTpopkontrzaehlEinheitWertesQuery({
      tpopkontrzaehlEinheitWerteGqlFilterForTree,
      apolloClient,
    }),
  )

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

    return (
      <Row
        key={el.id}
        node={node}
      />
    )
  })
}
