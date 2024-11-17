import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../../../../../../storeContext.js'
import { createTpopmassnbersQuery } from '../../../../../../../../../../../../../../../../modules/createTpopmassnbersQuery.js'

export const TpopMassnBer = memo(
  observer(({ projekt, ap, pop, tpop }) => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { tpopmassnberGqlFilterForTree } = store.tree
    console.log('Tree.TpopMassnBer', { tpopmassnberGqlFilterForTree })

    const { data } = useQuery(
      createTpopmassnbersQuery({
        tpopId: tpop.id,
        tpopmassnberGqlFilterForTree,
        apolloClient,
      }),
    )
    const tpopmassnbers =
      data?.data?.tpopById?.tpopmassnbersByTpopId?.nodes ?? []

    return tpopmassnbers.map((el) => {
      const node = {
        nodeType: 'table',
        menuType: 'tpopmassnber',
        parentId: tpop.id,
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
          'Massnahmen-Berichte',
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
