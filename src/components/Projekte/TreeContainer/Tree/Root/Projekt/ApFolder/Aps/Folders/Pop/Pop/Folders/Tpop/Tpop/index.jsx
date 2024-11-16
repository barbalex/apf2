import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../../../../storeContext.js'
import { TpopFolders } from './Folders/index.jsx'
import { createTpopsQuery } from '../../../../../../../../../../../../../../modules/createTpopsQuery.js'

export const Tpop = memo(
  observer(({ projekt, ap, pop }) => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { tpopGqlFilterForTree } = store.tree

    const { data } = useQuery(
      createTpopsQuery({ popId: pop.id, tpopGqlFilterForTree, apolloClient }),
    )

    return (data?.data?.popById?.tpopsByPopId?.nodes ?? []).map((el) => {
      const isOpen =
        store.tree.openNodes.filter(
          (n) =>
            n.length > 5 &&
            n[1] === projekt.id &&
            n[3] === ap.id &&
            n[4] === 'Populationen' &&
            n[5] === pop.id &&
            n[6] === 'Teil-Populationen' &&
            n[7] === el.id,
        ).length > 0

      const node = {
        nodeType: 'table',
        menuType: 'tpop',
        id: el.id,
        parentId: `${pop.id}TpopFolder`,
        parentTableId: pop.id,
        urlLabel: el.id,
        label: el.label,
        status: el.status,
        url: [
          'Projekte',
          projekt.id,
          'Arten',
          ap.id,
          'Populationen',
          pop.id,
          'Teil-Populationen',
          el.id,
        ],
        hasChildren: true,
      }

      return (
        <div key={el.id}>
          <Row node={node} />
          {isOpen && (
            <TpopFolders
              projekt={projekt}
              ap={ap}
              pop={pop}
              tpop={el}
            />
          )}
        </div>
      )
    })
  }),
)
