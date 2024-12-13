import { Row } from '../../../../../Row.jsx'

export const HistorienFolder = ({ projekt, ap, menu }) => {
  const url = ['Projekte', projekt.id, 'Arten', ap.id, 'Historien']

  const node = {
    nodeType: 'folder',
    menuType: 'historienFolder',
    id: `${ap.id}HistorienFolder`,
    tableId: ap.id,
    urlLabel: 'Historien',
    label: menu.label,
    url,
    hasChildren: false,
  }

  return <Row node={node} />
}
