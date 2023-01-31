import { gql } from '@apollo/client'

const tpopfeldkontrNodes = async ({
  data,
  projId,
  apId,
  popId,
  tpopId,
  store,
  treeQueryVariables,
}) => {
  // map through all elements and create array of nodes
  let nodes = (data?.allTpopfeldkontrs?.nodes ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'tpopfeldkontr',
    filterTable: 'tpopkontr',
    id: el.id,
    parentId: `${el.tpopId}TpopfeldkontrFolder`,
    parentTableId: el.tpopId,
    urlLabel: el.id,
    label: el.labelEk,
    url: [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      tpopId,
      'Feld-Kontrollen',
      el.id,
    ],
    hasChildren: true,
  }))

  return nodes
}

export default tpopfeldkontrNodes
