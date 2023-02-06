import Row from '../../../../../Row'

const IdealbiotopFolder = ({ projekt, ap }) => {
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

  return <Row node={node} />
}

export default IdealbiotopFolder
