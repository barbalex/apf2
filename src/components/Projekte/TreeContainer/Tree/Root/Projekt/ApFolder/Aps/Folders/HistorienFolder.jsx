import lowerFirst from 'lodash/lowerFirst'

import { Row } from '../../../../../Row.jsx'

export const HistorienFolder = ({ projekt, ap, menu, parentUrl }) => {
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
    id: `${ap.id}${menu.id}Folder`,
    tableId: ap.id,
    urlLabel: menu.id,
    label: menu.label,
    url,
    hasChildren: false,
  }

  return <Row node={node} />
}
