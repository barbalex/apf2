import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../../../../../../storeContext.js'
import { createTpopbersQuery } from '../../../../../../../../../../../../../../../../modules/createTpopbersQuery.js'

export const TpopBer = memo(
  observer(({ projekt, ap, pop, tpop }) => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { tpopberGqlFilterForTree } = store.tree

    const { data } = useQuery(
      createTpopbersQuery({
        tpopId: tpop.id,
        tpopberGqlFilterForTree,
        apolloClient,
      }),
    )

    return (data?.data?.tpopById?.tpopbersByTpopId?.nodes ?? []).map((el) => {
      const node = {
        nodeType: 'table',
        menuType: 'tpopber',
        parentId: `${tpop.id}TpopberFolder`,
        parentTableId: tpop.id,
        id: el.id,
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
          'Kontroll-Berichte',
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
