import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../../../../../../../storeContext.js'
import { ZaehlFolder } from './Zaehl/index.jsx'
import { createTpopfreiwkontrQuery } from '../../../../../../../../../../../../../../../../../modules/createTpopfreiwkontrQuery.js'

export const TpopFreiwkontr = memo(
  observer(({ projekt, ap, pop, tpop }) => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { ekfGqlFilterForTree } = store.tree

    const { data } = useQuery(
      createTpopfreiwkontrQuery({
        tpopId: tpop.id,
        ekfGqlFilterForTree,
        apolloClient,
      }),
    )

    return (data?.data?.tpopById?.tpopfreiwkontrs?.nodes ?? []).map((el) => {
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
            n[8] === 'Freiwilligen-Kontrollen' &&
            n[9] === el.id,
        ).length > 0

      const node = {
        nodeType: 'table',
        menuType: 'tpopfreiwkontr',
        id: el.id,
        tableId: el.id,
        parentId: `${tpop.id}TpopfreiwkontrFolder`,
        parentTableId: tpop.id,
        urlLabel: el.id,
        label: el.labelEkf,
        url: [
          'Projekte',
          projekt.id,
          'Arten',
          ap.id,
          'Populationen',
          pop.id,
          'Teil-Populationen',
          tpop.id,
          'Freiwilligen-Kontrollen',
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
