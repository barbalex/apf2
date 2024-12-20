import { memo } from 'react'
import lowerFirst from 'lodash/lowerFirst'

import { Row } from '../../../../../../../../../../../Row.jsx'

export const ChildlessFolder = memo(
  ({ projekt, ap, pop, tpop, menu, parentUrl }) => {
    const url = [
      ...parentUrl
        .split('/')
        .filter((el) => el)
        .slice(1),
      menu.id,
    ]

    const node = {
      nodeType: 'folder',
      menuType: `${lowerFirst(menu.id)}Folder`,
      id: `${tpop.id}${menu.id}Folder`,
      tableId: tpop.id,
      urlLabel: menu.id,
      label: menu.label,
      url,
      hasChildren: false,
    }

    return <Row node={node} />
  },
)
