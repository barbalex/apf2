import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import union from 'lodash/union'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../storeContext.js'
import { ZielJahre } from './ZielJahre/index.jsx'
import { createZielsQuery } from '../../../../../../../../../../modules/createZielsQuery.js'

export const ApZielFolder = memo(
  observer(({ projekt, ap }) => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { openNodes, zielGqlFilterForTree } = store.tree

    const { data, isLoading } = useQuery(
      createZielsQuery({
        apId: ap.id,
        zielGqlFilterForTree,
        apolloClient,
      }),
    )

    const nodeLabelFilterString = store.tree?.nodeLabelFilter?.ziel ?? ''

    const ziels = data?.data?.apById?.zielsByApId?.nodes ?? []
    const zieljahre = ziels
      // reduce to distinct years
      .reduce((a, el) => union(a, [el.jahr]), [])
      .sort((a, b) => a - b)
    const zieljahreLength = zieljahre.length
    const message =
      isLoading ? '...'
      : nodeLabelFilterString ?
        `${zieljahreLength} ${zieljahreLength === 1 ? 'Jahr' : 'Jahre'} gefiltert`
      : `${zieljahreLength} ${zieljahreLength === 1 ? 'Jahr' : 'Jahre'}`

    const url = ['Projekte', projekt.id, 'Arten', ap.id, 'AP-Ziele']

    const isOpen =
      openNodes.filter(
        (n) =>
          n.length > 4 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'AP-Ziele',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'zielFolder',
      id: `${ap.id}ApzielFolder`,
      tableId: ap.id,
      urlLabel: 'AP-Ziele',
      label: `AP-Ziele (${message})`,
      url,
      hasChildren: zieljahreLength > 0,
    }

    console.log('tree.ApZiel.index', { ziels, zieljahre, data: data?.data })

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <ZielJahre
            projekt={projekt}
            ap={ap}
            ziels={ziels}
            zieljahre={zieljahre}
          />
        )}
      </>
    )
  }),
)
