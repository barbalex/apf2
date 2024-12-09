import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../mobxContext.js'
import { ZielberFolder } from './Zielber/index.js'
import { useZielsOfJahrNavData } from '../../../../../../../../../../../modules/useZielsOfJahrNavData.js'
import { Ziel } from './Ziel/index.jsx'

export const Ziels = memo(
  observer(({ projekt, ap, jahr }) => {
    const store = useContext(MobxContext)

    const { navData, isLoading, error } = useZielsOfJahrNavData({
      projId: projekt.id,
      apId: ap.id,
      jahr,
    })

    const node = {
      nodeType: 'folder',
      menuType: 'zielFolder',
      id: `${ap.id}Ziele${navData.jahr ?? 'keinJahr'}`,
      jahr,
      // parentId: `${ap.id}Ziele${navData.jahr ?? 'keinJahr'}`,
      urlLabel: `${jahr ?? 'kein Jahr'}`,
      label: navData.label,
      url: ['Projekte', projekt.id, 'Arten', ap.id, 'AP-Ziele', jahr],
      hasChildren: true,
    }

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 6 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'AP-Ziele' &&
          n[5] === jahr,
      ).length > 0

    return navData.menus.map((menu) => (
      <Ziel
        key={menu.id}
        projekt={projekt}
        ap={ap}
        jahr={jahr}
        menu={menu}
      />
    ))
  }),
)
