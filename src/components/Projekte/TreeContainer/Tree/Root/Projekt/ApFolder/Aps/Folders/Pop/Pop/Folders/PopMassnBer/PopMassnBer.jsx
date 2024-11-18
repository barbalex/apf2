import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../../../storeContext.js'
import { createPopmassnbersQuery } from '../../../../../../../../../../../../../modules/createPopmassnbersQuery.js'

export const PopMassnBer = memo(
  observer(({ projekt, ap, pop }) => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { popmassnberGqlFilterForTree } = store.tree

    const { data } = useQuery(
      createPopmassnbersQuery({
        popId: pop.id,
        popmassnberGqlFilterForTree,
        apolloClient,
      }),
    )

    return (data?.data?.popById?.popmassnbersByPopId?.nodes ?? []).map((el) => {
      const node = {
        nodeType: 'table',
        menuType: 'popmassnber',
        id: el.id,
        parentId: pop.id,
        parentTableId: pop.id,
        urlLabel: el.id,
        label: el.label,
        url: [
          'Projekte',
          projekt.id,
          'Arten',
          ap.id,
          'Populationen',
          pop.id,
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
