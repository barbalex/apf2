import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../../../../../../storeContext.js'
import { createBeobsQuery } from '../../../../../../../../../../../../../../../../modules/createBeobsQuery.js'

export const BeobZugeordnet = memo(
  observer(({ projekt, ap, pop, tpop }) => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { beobGqlFilterForTree } = store.tree

    const { data } = useQuery(
      createBeobsQuery({
        tpopId: tpop.id,
        beobGqlFilterForTree,
        apolloClient,
        type: 'zugeordnet',
      }),
    )

    return (data?.data?.allBeobs?.nodes ?? []).map((el) => {
      const node = {
        nodeType: 'table',
        menuType: 'beobZugeordnet',
        id: el.id,
        parentId: `${tpop.id}BeobZugeordnetFolder`,
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
          'Beobachtungen',
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
