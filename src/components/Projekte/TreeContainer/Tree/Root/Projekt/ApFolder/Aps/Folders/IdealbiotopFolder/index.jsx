import { Row } from '../../../../../Row.jsx'
import { ChildlessFolder } from './ChildlessFolder.jsx'

export const IdealbiotopFolder = ({ projekt, ap }) => {
  const url = ['Projekte', projekt.id, 'Arten', ap.id, 'Idealbiotop']

  const node = {
    nodeType: 'folder',
    menuType: 'idealbiotopFolder',
    id: `${ap.id}IdealbiotopFolder`,
    tableId: ap.id,
    urlLabel: 'Idealbiotop',
    label: 'Idealbiotop',
    url,
    hasChildren: false,
  }

  return (
    <>
      <Row node={node} />
      <ChildlessFolder
        projekt={projekt}
        ap={ap}
      />
    </>
  )
}
