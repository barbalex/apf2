import { Row } from '../../../../../Row.jsx'

export const Qk = ({ projekt, ap }) => {
  const url = ['Projekte', projekt.id, 'Arten', ap.id, 'Qualitaetskontrollen']

  const node = {
    nodeType: 'folder',
    menuType: 'qkFolder',
    id: `${ap.id}QkFolder`,
    tableId: ap.id,
    parentTableId: ap.id,
    urlLabel: 'Qualitaetskontrollen',
    label: 'Qualitätskontrollen',
    url,
    hasChildren: false,
  }

  return <Row node={node} />
}
