import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../storeContext.js'
import { createEkfrequenzsQuery } from '../../../../../../../../../../modules/createEkfrequenzsQuery.js'

export const EkFrequenz = memo(
  observer(({ projekt, ap }) => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { ekfrequenzGqlFilterForTree } = store.tree

    const { data } = useQuery(
      createEkfrequenzsQuery({
        apId: ap.id,
        ekfrequenzGqlFilterForTree,
        apolloClient,
      }),
    )

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

      return (
        <Row
          key={el.id}
          node={node}
        />
      )
    })
  }),
)
