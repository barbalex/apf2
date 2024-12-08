import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../storeContext.js'
import { Pop } from './Pop/index.jsx'

export const PopFolder = memo(
  observer(({ projekt, ap,   menu }) => {
    const store = useContext(MobxContext)


    const url = ['Projekte', projekt.id, 'Arten', ap.id, 'Populationen']

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 4 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'Populationen',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'popFolder',
      id: `${ap.id}PopFolder`,
      tableId: ap.id,
      urlLabel: 'Populationen',
      label: menu.label,
      url,
      hasChildren: menu.count > 0,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <Pop
            projekt={projekt}
            ap={ap}
          />
        )}
      </>
    )
  }),
)
