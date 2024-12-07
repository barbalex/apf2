import { memo, useMemo } from 'react'

import { useCurrentissuesNavData } from '../../../../../../modules/useCurrentissuesNavData.js'
import { Issue } from './Issue.jsx'

export const Issues = memo(({ in: inProp }) => {
  const { navData } = useCurrentissuesNavData()

  const nodes = useMemo(
    () =>
      navData?.menus.map((menu) => ({
        nodeType: 'table',
        menuType: 'currentIssue',
        id: menu.id,
        urlLabel: menu.id,
        label: menu.label,
        url: ['Aktuelle-Fehler', menu.id],
        hasChildren: false,
      })),
    [navData],
  )

  return nodes.map((node) => (
    <Issue
      key={node.id}
      inProp={inProp}
      menu={node}
    />
  ))
})
