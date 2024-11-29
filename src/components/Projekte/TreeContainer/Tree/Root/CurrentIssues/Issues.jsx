import { memo } from 'react'

import { Row } from '../../Row.jsx'
import { useCurrentissuesNavData } from '../../../../../../modules/useCurrentissuesNavData.js'

export const Issues = memo(() => {
  const { navData } = useCurrentissuesNavData()

  const currentIssues = navData?.menus ?? []
  const nodes = currentIssues.map((el) => ({
    nodeType: 'table',
    menuType: 'currentIssue',
    id: el.id,
    urlLabel: el.id,
    label: el.label,
    url: ['Aktuelle-Fehler', el.id],
    hasChildren: false,
  }))

  return nodes.map((node) => (
    <Row
      key={node.id}
      node={node}
    />
  ))
})
