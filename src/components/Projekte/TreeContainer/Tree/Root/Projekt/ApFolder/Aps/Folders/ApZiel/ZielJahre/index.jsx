import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../storeContext.js'
import { Ziel } from './Ziel/index.jsx'

export const ZielJahre = memo(
  observer(({ projekt, ap, menus }) => {
    const store = useContext(StoreContext)


    return menus.map(({id, label}) => {

      const isOpen =
        store.tree.openNodes.filter(
          (n) =>
            n[1] === projekt.id &&
            n[3] === ap.id &&
            n[4] === 'AP-Ziele' &&
            n[5] === label,
        ).length > 0

      const node = {
        nodeType: 'folder',
        menuType: 'zieljahrFolder',
        id: `${ap.id}Ziele${label ?? 'keinJahr'}`,
        jahr: label,
        parentId: ap.id,
        urlLabel: `${label ?? 'kein Jahr'}`,
        label: label,
        url: ['Projekte', projekt.id, 'Arten', ap.id, 'AP-Ziele', label],
        hasChildren: true,
      }

      return (
        <div key={`${ap.id}/${label}`}>
          <Row node={node} />
          {isOpen && (
            <Ziel
              projekt={projekt}
              ap={ap}
              jahr={label}
            />
          )}
        </div>
      )
    })
  }),
)
