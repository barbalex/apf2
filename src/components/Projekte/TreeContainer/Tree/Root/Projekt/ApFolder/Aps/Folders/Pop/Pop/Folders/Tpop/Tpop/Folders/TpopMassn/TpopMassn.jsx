import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../../../../../../storeContext.js'
import { createTpopmassnsQuery } from '../../../../../../../../../../../../../../../../modules/createTpopmassnsQuery.js'

export const TpopMassn = memo(
  observer(({ projekt, ap, pop, tpop }) => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { tpopmassnGqlFilterForTree } = store.tree

    const { data } = useQuery(
      createTpopmassnsQuery({
        tpopId: tpop.id,
        apolloClient,
        tpopmassnGqlFilterForTree,
      }),
    )
    const tpopmassns = data?.data?.tpopById?.tpopmassnsByTpopId?.nodes ?? []

    return tpopmassns.map((el) => {
      const node = {
        nodeType: 'table',
        menuType: 'tpopmassn',
        id: el.id,
        parentId: tpop.id,
        parentTableId: tpop.id,
        urlLabel: el.id,
        label: el.label,
        url: [
          'Projekte',
          projekt.id,
          'Arten',
          ap.id,
          'Populationen',
          pop.id,
          'Teil-Populationen',
          tpop.id,
          'Massnahmen',
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
