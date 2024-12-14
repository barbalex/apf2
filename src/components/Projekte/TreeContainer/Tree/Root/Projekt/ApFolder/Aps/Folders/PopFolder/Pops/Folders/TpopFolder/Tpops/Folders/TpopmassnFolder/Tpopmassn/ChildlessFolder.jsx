import lowerFirst from 'lodash/lowerFirst'

import { Row } from '../../../../../../../../../../../../../Row.jsx'

export const ChildlessFolder = ({
  projekt,
  ap,
  pop,
  tpop,
  tpopmassn,
  menu,
  parentUrl,
}) => {
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
    id: `${tpopmassn.id}${menu.id}Folder`,
    tableId: tpopmassn.id,
    urlLabel: menu.id,
    label: menu.label,
    url,
    hasChildren: false,
  }

  return <Row node={node} />
}
