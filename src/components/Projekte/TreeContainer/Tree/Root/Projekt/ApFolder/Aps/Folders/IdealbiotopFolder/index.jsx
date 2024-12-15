import { memo, useMemo } from 'react'

import { Row } from '../../../../../../Row.jsx'
import { ChildlessFolder } from './ChildlessFolder.jsx'
import { useIdealbiotopNavData } from '../../../../../../../../../../modules/useIdealbiotopNavData.js'

export const IdealbiotopFolder = memo(({ projekt, ap }) => {
  const url = ['Projekte', projekt.id, 'Arten', ap.id, 'Idealbiotop']

  const { navData } = useIdealbiotopNavData({ projId: projekt.id, apId: ap.id })

  const node = {
    nodeType: 'folder',
    menuType: 'idealbiotopFolder',
    id: `${ap.id}IdealbiotopFolder`,
    tableId: ap.id,
    urlLabel: 'Idealbiotop',
    label: 'Idealbiotop',
    url,
    hasChildren: false,
  }

  const dateienMenu = useMemo(
    () => navData?.menus.find((m) => m.id === 'Dateien'),
    [navData],
  )

  return (
    <>
      <Row node={node} />
      <ChildlessFolder
        projekt={projekt}
        ap={ap}
        menu={dateienMenu}
      />
    </>
  )
})
