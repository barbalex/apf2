import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { gql, useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../Row.jsx'
import { StoreContext } from '../../../../../../../storeContext.js'
import { createEkAbrechnungstypWertesQuery } from '../../../../../../../modules/createEkAbrechnungstypWertesQuery.js'

export const EkAbrechnungstyp = memo(
  observer(() => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { ekAbrechnungstypWerteGqlFilterForTree } = store.tree

    const { data } = useQuery(
      createEkAbrechnungstypWertesQuery({
        ekAbrechnungstypWerteGqlFilterForTree,
        apolloClient,
      }),
    )

    return (data?.data?.allEkAbrechnungstypWertes?.nodes ?? []).map((el) => {
      const node = {
        nodeType: 'table',
        menuType: 'ekAbrechnungstypWerte',
        id: el.id,
        parentId: 'ekAbrechnungstypWerteFolder',
        urlLabel: el.id,
        label: el.label,
        url: ['Werte-Listen', 'EkAbrechnungstypWerte', el.id],
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
