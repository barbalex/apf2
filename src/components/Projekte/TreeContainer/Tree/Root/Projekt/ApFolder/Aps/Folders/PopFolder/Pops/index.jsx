import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../mobxContext.js'
import { PopFolders } from './PopFolders/index.jsx'
import { usePopsNavData } from '../../../../../../../../../../../modules/usePopsNavData.js'

export const Pops = memo(
  observer(({ projekt, ap }) => {
    const store = useContext(MobxContext)
    const { popGqlFilterForTree } = store.tree

    const { navData } = usePopsNavData({ projId: projekt.id, apId: ap.id })

    return navData.menus.map((menu) => {
      const node = {
        nodeType: 'table',
        menuType: 'pop',
        id: menu.id,
        parentId: `${ap.id}PopFolder`,
        parentTableId: ap.id,
        urlLabel: menu.id,
        label: menu.label,
        status: menu.status,
        url: ['Projekte', projekt.id, 'Arten', ap.id, 'Populationen', menu.id],
        hasChildren: true,
      }
      const isOpen =
        store.tree.openNodes.filter(
          (n) =>
            n.length > 5 &&
            n[1] === projekt.id &&
            n[3] === ap.id &&
            n[4] === 'Populationen' &&
            n[5] === menu.id,
        ).length > 0

      return (
        <div key={menu.id}>
          <Row node={node} />
          {isOpen && (
            <PopFolders
              projekt={projekt}
              ap={ap}
              pop={menu}
            />
          )}
        </div>
      )
    })
  }),
)
