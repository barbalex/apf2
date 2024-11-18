import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../../../../../../../storeContext.js'
import { ZaehlFolder } from './Zaehl/index.jsx'
import { createTpopfeldkontrQuery } from '../../../../../../../../../../../../../../../../../modules/createTpopfeldkontrQuery.js'

export const TpopFeldkontr = memo(
  observer(({ projekt, ap, pop, tpop }) => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { ekGqlFilterForTree } = store.tree

    const { data } = useQuery(
      createTpopfeldkontrQuery({
        tpopId: tpop.id,
        ekGqlFilterForTree,
        apolloClient,
      }),
    )

    return (data?.data?.tpopById?.tpopfeldkontrs?.nodes ?? []).map((el) => {
      const isOpen =
        store.tree.openNodes.filter(
          (n) =>
            n.length > 5 &&
            n[1] === projekt.id &&
            n[3] === ap.id &&
            n[4] === 'Populationen' &&
            n[5] === pop.id &&
            n[6] === 'Teil-Populationen' &&
            n[7] === tpop.id &&
            n[8] === 'Feld-Kontrollen' &&
            n[9] === el.id,
        ).length > 0

      const node = {
        nodeType: 'table',
        menuType: 'tpopfeldkontr',
        id: el.id,
        parentId: `${tpop.id}TpopfeldkontrFolder`,
        parentTableId: tpop.id,
        urlLabel: el.id,
        label: el.labelEk,
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
          el.id,
        ],
        hasChildren: true,
      }

      return (
        <div key={el.id}>
          <Row node={node} />
          {isOpen && (
            <ZaehlFolder
              projekt={projekt}
              ap={ap}
              pop={pop}
              tpop={tpop}
              tpopkontr={el}
            />
          )}
        </div>
      )
    })
  }),
)
