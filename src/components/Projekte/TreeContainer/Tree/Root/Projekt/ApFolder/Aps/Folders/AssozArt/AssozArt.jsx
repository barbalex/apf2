import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../storeContext.js'
import { createAssozartsQuery } from '../../../../../../../../../../modules/createAssozartsQuery.js'

export const AssozArt = memo(
  observer(({ projekt, ap }) => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { assozartGqlFilterForTree } = store.tree

    const { data } = useQuery(
      createAssozartsQuery({
        apId: ap.id,
        assozartGqlFilterForTree,
        apolloClient,
      }),
    )

    return (data?.data?.apById?.assozartsByApId?.nodes ?? []).map((el) => {
      const node = {
        nodeType: 'table',
        menuType: 'assozart',
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
          'assoziierte-Arten',
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
