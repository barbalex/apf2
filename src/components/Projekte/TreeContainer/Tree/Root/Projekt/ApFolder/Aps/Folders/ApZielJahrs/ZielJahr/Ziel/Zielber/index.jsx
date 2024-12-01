import { memo, useContext } from 'react'
import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../../../storeContext.js'
import { Zielber } from './Zielber.jsx'
import { createZielbersQuery } from '../../../../../../../../../../../../../modules/createZielbersQuery.js'

export const ZielberFolder = memo(
  observer(({ projekt, ap, jahr, ziel }) => {
    const store = useContext(StoreContext)
    const { zielberGqlFilterForTree, nodeLabelFilter } = store.tree
    const apolloClient = useApolloClient()

    const { data, isLoading } = useQuery(
      createZielbersQuery({
        zielId: ziel.id,
        zielberGqlFilterForTree,
        apolloClient,
      }),
    )

    const isFiltered = !!nodeLabelFilter?.zielber
    const zielbers = data?.data?.zielById?.zielbersByZielId?.nodes ?? []
    const zielbersLength = zielbers.length

    const message =
      isLoading ? '...'
      : isFiltered ? `${zielbersLength} gefiltert`
      : zielbersLength

    const url = [
      'Projekte',
      projekt.id,
      'Arten',
      ap.id,
      'AP-Ziele',
      jahr,
      ziel.id,
      'Berichte',
    ]

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 7 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'AP-Ziele' &&
          n[5] === jahr &&
          n[6] === ziel.id,
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'zielberFolder',
      id: `${ziel.id}ZielberFolder`,
      tableId: ziel.id,
      urlLabel: 'Berichte',
      label: `Berichte (${message})`,
      url,
      hasChildren: zielbersLength > 0,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <Zielber
            zielbers={zielbers}
            projekt={projekt}
            ap={ap}
            jahr={jahr}
            ziel={ziel}
          />
        )}
      </>
    )
  }),
)
