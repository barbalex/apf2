import { memo, useMemo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row.jsx'
import { ChildlessFolder } from './ChildlessFolder.jsx'
import { useIdealbiotopNavData } from '../../../../../../../../../../modules/useIdealbiotopNavData.js'
import { MobxContext } from '../../../../../../../../../../mobxContext.js'

export const IdealbiotopFolder = memo(
  observer(({ projekt, ap }) => {
    const store = useContext(MobxContext)
    const { openNodes } = store.tree

    const url = ['Projekte', projekt.id, 'Arten', ap.id, 'Idealbiotop']

    const { navData } = useIdealbiotopNavData({
      projId: projekt.id,
      apId: ap.id,
    })

    const node = {
      nodeType: 'folder',
      menuType: 'idealbiotopFolder',
      id: `${ap.id}IdealbiotopFolder`,
      tableId: ap.id,
      urlLabel: 'Idealbiotop',
      label: 'Idealbiotop',
      url,
      hasChildren: true,
    }

    const isOpen =
      openNodes.filter(
        (n) =>
          n[0] === 'Projekte' &&
          n[1] === projekt.id &&
          n[2] === 'Arten' &&
          n[3] === ap.id &&
          n[4] === 'Idealbiotop',
      ).length > 0

    const dateienMenu = useMemo(
      () => navData?.menus.find((m) => m.id === 'Dateien'),
      [navData],
    )

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <ChildlessFolder
            projekt={projekt}
            ap={ap}
            menu={dateienMenu}
          />
        )}
      </>
    )
  }),
)
