import { memo } from 'react'

import { Row } from './Row.jsx'
import { nodeFromMenu } from './nodeFromMenu.js'

export const Node = memo(({ menu }) => {
  const node = nodeFromMenu(menu)

  return <Row node={node} />
})
