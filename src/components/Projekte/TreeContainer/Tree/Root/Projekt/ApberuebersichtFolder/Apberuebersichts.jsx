import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../Row.jsx'
import { StoreContext } from '../../../../../../../storeContext.js'
import { createApberuebersichtsQuery } from '../../../../../../../modules/createApberuebersichtsQuery.js'

export const Apberuebersichts = memo(
  observer(({ projekt }) => {
    const apolloClient = useApolloClient()

    const store = useContext(StoreContext)
    const { apberuebersichtGqlFilterForTree } = store.tree

    const { data } = useQuery(
      createApberuebersichtsQuery({
        projId: projekt.id,
        apberuebersichtGqlFilterForTree,
        apolloClient,
      }),
    )

    return (data?.data?.allApberuebersichts?.nodes ?? []).map((el) => {
      const node = {
        nodeType: 'table',
        menuType: 'apberuebersicht',
        id: el.id,
        parentId: el.projId,
        parentTableId: el.projId,
        urlLabel: el.label || '(kein Jahr)',
        label: el.label,
        url: ['Projekte', el.projId, 'AP-Berichte', el.id],
        hasChildren: false,
      }

      return (
        <Row
          key={el.id}
          node={node}
        />
      )
    })
  }),
)
