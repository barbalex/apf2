import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../storeContext.js'
import { createApartsQuery } from '../../../../../../../../../../modules/createApartsQuery.js'

export const ApArt = memo(
  observer(({ projekt, ap }) => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { apartGqlFilterForTree } = store.tree

    const { data } = useQuery(
      createApartsQuery({
        apId: ap.id,
        apartGqlFilterForTree,
        apolloClient,
      }),
    )

    return (data?.data?.apById?.apartsByApId?.nodes ?? []).map((el) => {
      const node = {
        nodeType: 'table',
        menuType: 'apart',
        id: el.id,
        parentId: ap.id,
        parentTableId: ap.id,
        urlLabel: el.id,
        label: el.label,
        url: ['Projekte', projekt.id, 'Arten', ap.id, 'Taxa', el.id],
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
