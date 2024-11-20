import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { gql, useApolloClient } from '@apollo/client'

import { Row } from '../../../Row.jsx'
import { StoreContext } from '../../../../../../../storeContext.js'
import { createTpopApberrelevantGrundWertesQuery } from '../../../../../../../modules/createTpopApberrelevantGrundWertesQuery.js'

export const ApberrelevantGrund = () => {
  const apolloClient = useApolloClient()
  const store = useContext(StoreContext)
  const { tpopApberrelevantGrundWerteGqlFilterForTree } = store.tree

  const { data } = useQuery(
    createTpopApberrelevantGrundWertesQuery({
      tpopApberrelevantGrundWerteGqlFilterForTree,
      apolloClient,
    }),
  )

  const nodes = (data?.data?.allTpopApberrelevantGrundWertes?.nodes ?? []).map(
    (el) => ({
      nodeType: 'table',
      menuType: 'tpopApberrelevantGrundWerte',
      id: el.id,
      parentId: 'tpopApberrelevantGrundWerteFolder',
      urlLabel: el.id,
      label: el.label,
      url: ['Werte-Listen', 'ApberrelevantGrundWerte', el.id],
      hasChildren: false,
    }),
  )

  if (!nodes.length) return null

  return nodes.map((node) => (
    <Row
      key={node.id}
      node={node}
    />
  ))
}
