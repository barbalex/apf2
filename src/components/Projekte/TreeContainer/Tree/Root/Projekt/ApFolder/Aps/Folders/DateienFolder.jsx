import { Row } from '../../../../../Row.jsx'

export const DateienFolder = ({ projekt, ap, menu }) => {
  const url = ['Projekte', projekt.id, 'Arten', ap.id, 'Dateien']

  const node = {
    nodeType: 'folder',
    menuType: 'dateienFolder',
    id: `${ap.id}DateienFolder`,
    tableId: ap.id,
    urlLabel: 'Dateien',
    label: menu.label,
    url,
    hasChildren: false,
  }

  return <Row node={node} />
}
