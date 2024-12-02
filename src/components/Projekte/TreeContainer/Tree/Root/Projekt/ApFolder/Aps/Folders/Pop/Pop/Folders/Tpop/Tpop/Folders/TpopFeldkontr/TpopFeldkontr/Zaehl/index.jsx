import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'

import { Row } from '../../../../../../../../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../../../../../../../../storeContext.js'
import { Zaehl } from './Zaehl.jsx'
import { useTpopfeldkontrNavData } from '../../../../../../../../../../../../../../../../../../modules/useTpopfeldkontrNavData.js'

export const ZaehlFolder = memo(
  observer(({ projekt, ap, pop, tpop, tpopkontr }) => {
    const client = useApolloClient()
    const store = useContext(StoreContext)
    const { nodeLabelFilter } = store.tree

    const { navData, isLoading } = useTpopfeldkontrNavData({
      projId: projekt.id,
      apId: ap.id,
      popId: pop.id,
      tpopId: tpop.id,
      tpopkontrId: tpopkontr.id,
    })

    const url = [
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
    ]

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'Populationen' &&
          n[5] === pop.id &&
          n[6] === 'Teil-Populationen' &&
          n[7] === tpop.id &&
          n[8] === 'Feld-Kontrollen' &&
          n[9] === tpopkontr.id &&
          n[10] === 'Zaehlungen',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'tpopfeldkontrzaehlFolder',
      id: `${tpopkontr.id}TpopfeldkontrzaehlFolder`,
      tableId: tpopkontr.id,
      urlLabel: 'Zaehlungen',
      label: navData?.menus?.[0]?.label,
      url,
      hasChildren: true,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <Zaehl
            projekt={projekt}
            ap={ap}
            pop={pop}
            tpop={tpop}
            tpopkontr={tpopkontr}
          />
        )}
      </>
    )
  }),
)
