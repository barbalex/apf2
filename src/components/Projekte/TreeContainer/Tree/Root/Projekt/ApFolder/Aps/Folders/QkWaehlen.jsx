import { Row } from '../../../../../Row.jsx'

export const QkWaehlen = ({ projekt, ap }) => {
  const url = [
    'Projekte',
    projekt.id,
    'Arten',
    ap.id,
    'Qualitätskontrollen-wählen',
  ]

  const node = {
    nodeType: 'folder',
    menuType: 'qkFolder',
    id: `${ap.id}QkFolder`,
    tableId: ap.id,
    parentTableId: ap.id,
    urlLabel: 'Qualitätskontrollen-wählen',
    label: 'Qualitätskontrollen wählen',
    url,
    hasChildren: false,
  }

  return <Row node={node} />
}
