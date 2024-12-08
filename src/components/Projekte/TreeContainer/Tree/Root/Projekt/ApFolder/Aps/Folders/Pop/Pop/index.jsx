import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../storeContext.js'
import { PopFolders } from './Folders/index.jsx'
import { usePopsNavData } from '../../../../../../../../../../../modules/usePopsNavData.js'

export const Pop = memo(
  observer(({ projekt, ap }) => {
    const apolloClient = useApolloClient()
    const store = useContext(MobxContext)
    const { popGqlFilterForTree } = store.tree

    const { navData } = usePopsNavData({ projId: projekt.id, apId: ap.id })

    return navData.menus.map((el) => {
      const node = {
        nodeType: 'table',
        menuType: 'pop',
        id: el.id,
        parentId: `${ap.id}PopFolder`,
        parentTableId: ap.id,
        urlLabel: el.id,
        label: el.label,
        status: el.status,
        url: ['Projekte', projekt.id, 'Arten', ap.id, 'Populationen', el.id],
        hasChildren: true,
      }
      const isOpen =
        store.tree.openNodes.filter(
          (n) =>
            n.length > 5 &&
            n[1] === projekt.id &&
            n[3] === ap.id &&
            n[4] === 'Populationen' &&
            n[5] === el.id,
        ).length > 0

      return (
        <div key={el.id}>
          <Row node={node} />
          {isOpen && (
            <PopFolders
              projekt={projekt}
              ap={ap}
              pop={el}
            />
          )}
        </div>
      )
    })
  }),
)
