import { gql } from '@apollo/client'

const popNodes = ({ data, projId, apId }) => {
  // map through all elements and create array of nodes
  const nodes = (data?.allPops?.nodes ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'pop',
    filterTable: 'pop',
    id: el.id,
    parentId: `${el.apId}PopFolder`,
    parentTableId: el.apId,
    urlLabel: el.id,
    label: el.label,
    url: ['Projekte', projId, 'Arten', el.apId, 'Populationen', el.id],
    hasChildren: true,
    nr: el.nr || 0,
  }))

  return nodes
}

export default popNodes
