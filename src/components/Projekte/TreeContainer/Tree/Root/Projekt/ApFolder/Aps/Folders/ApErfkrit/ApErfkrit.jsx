import { memo, useContext } from 'react'
import { useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../storeContext.js'
import { createErfkritsQuery } from '../../../../../../../../../../modules/createErfkritsQuery.js'

export const ApErfkrit = memo(
  observer(({ projekt, ap }) => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { erfkritGqlFilterForTree } = store.tree

    const { data } = useQuery(
      createErfkritsQuery({
        apId: ap.id,
        erfkritGqlFilterForTree,
        apolloClient,
      }),
    )

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

      return (
        <Row
          key={el.id}
          node={node}
        />
      )
    })
  }),
)
