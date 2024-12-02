import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../Row.jsx'
import { StoreContext } from '../../../../../../../storeContext.js'
import { useApberuebersichtsNavData } from '../../../../../../../modules/useApberuebersichtsNavData.js'

export const Apberuebersichts = memo(
  observer(({ projekt }) => {
    const apolloClient = useApolloClient()
    const projId = projekt.id

    const store = useContext(StoreContext)
    const { apberuebersichtGqlFilterForTree } = store.tree

    const { navData } = useApberuebersichtsNavData({ projId })

    return navData.menus.map((el) => {
      const node = {
        nodeType: 'table',
        menuType: 'apberuebersicht',
        id: el.id,
        parentId: projId,
        parentTableId: projId,
        urlLabel: el.label || '(kein Jahr)',
        label: el.label,
        url: ['Projekte', projId, 'AP-Berichte', el.id],
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
