import { useContext } from 'react'
import { gql, useApolloClient } from '@apollo/client'
import { useQueryClient, useQuery } from '@tanstack/react-query'

import { Row } from '../../../Row.jsx'
import { StoreContext } from '../../../../../../../storeContext.js'
import { createAdressesQuery } from '../../../../../../../modules/createAdressesQuery.js'

export const Adresse = () => {
  const apolloClient = useApolloClient()
  const tanstackClient = useQueryClient()
  const store = useContext(StoreContext)
  const { adresseGqlFilterForTree } = store.tree

  const { data } = useQuery(
    createAdressesQuery({
      adresseGqlFilterForTree,
      apolloClient,
    }),
  )

  return (data?.data?.allAdresses?.nodes ?? []).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'adresse',
      id: el.id,
      parentId: 'adresseFolder',
      urlLabel: el.id,
      label: el.label,
      url: ['Werte-Listen', 'Adressen', el.id],
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
