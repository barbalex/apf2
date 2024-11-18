import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../../../storeContext.js'
import { createPopbersQuery } from '../../../../../../../../../../../../../modules/createPopbersQuery.js'

export const PopBer = memo(
  observer(({ projekt, ap, pop }) => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { popberGqlFilterForTree } = store.tree

    const { data } = useQuery(
      createPopbersQuery({
        popId: pop.id,
        popberGqlFilterForTree,
        apolloClient,
      }),
    )

    return (data?.data?.popById?.popbersByPopId?.nodes ?? []).map((el) => {
      const node = {
        nodeType: 'table',
        menuType: 'popber',
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
