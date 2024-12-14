import { memo } from 'react'

import { Row } from '../../../../../../../../../../Row.jsx'
import { TpopFolders } from './Folders/index.jsx'

export const Tpop = memo(({ projekt, ap, pop, menu }) => {
  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 5 &&
        n[1] === projekt.id &&
        n[3] === ap.id &&
        n[4] === 'Populationen' &&
        n[5] === pop.id &&
        n[6] === 'Teil-Populationen' &&
        n[7] === menu.id,
    ).length > 0

  const node = {
    nodeType: 'table',
    menuType: 'tpop',
    id: menu.id,
    parentId: `${pop.id}TpopFolder`,
    parentTableId: pop.id,
    urlLabel: menu.id,
    label: menu.label,
    status: menu.status,
    url: [
      'Projekte',
      projekt.id,
      'Arten',
      ap.id,
      'Populationen',
      pop.id,
      'Teil-Populationen',
      menu.id,
    ],
    hasChildren: true,
  }

  return (
    <div key={menu.id}>
      <Row node={node} />
      {isOpen && (
        <TpopFolders
          projekt={projekt}
          ap={ap}
          pop={pop}
          tpop={menu}
        />
      )}
    </div>
  )
})
