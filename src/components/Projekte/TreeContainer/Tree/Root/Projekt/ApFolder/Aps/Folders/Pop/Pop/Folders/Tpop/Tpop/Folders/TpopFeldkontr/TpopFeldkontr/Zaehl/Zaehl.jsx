import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../../../../../../../../storeContext.js'
import { createTpopkontrzaehlsQuery } from '../../../../../../../../../../../../../../../../../../modules/createTpopkontrzaehlsQuery.js'

export const Zaehl = memo(
  observer(({ projekt, ap, pop, tpop, tpopkontr }) => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { tpopkontrzaehlGqlFilterForTree } = store.tree

    const { data } = useQuery(
      createTpopkontrzaehlsQuery({
        tpopkontrId: tpopkontr.id,
        tpopkontrzaehlGqlFilterForTree,
        apolloClient,
      }),
    )

    return (
      data?.data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []
    ).map((el) => {
      const node = {
        nodeType: 'table',
        menuType: 'tpopfeldkontrzaehl',
        id: el.id,
        parentId: `${tpopkontr.id}TpopfeldkontrzaehlFolder`,
        parentTableId: tpopkontr.id,
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
          'Feld-Kontrollen',
          tpopkontr.id,
          'Zaehlungen',
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
