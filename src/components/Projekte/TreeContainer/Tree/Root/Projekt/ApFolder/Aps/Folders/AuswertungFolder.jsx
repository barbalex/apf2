import { Row } from '../../../../../Row.jsx'

export const AuswertungFolder = ({ projekt, ap, menu }) => {
  const url = ['Projekte', projekt.id, 'Arten', ap.id, 'Auswertung']

  const node = {
    nodeType: 'folder',
    menuType: 'auswertungFolder',
    id: `${ap.id}AuswertungFolder`,
    tableId: ap.id,
    urlLabel: 'Auswertung',
    label: menu.label,
    url,
    hasChildren: false,
  }

  return <Row node={node} />
}
