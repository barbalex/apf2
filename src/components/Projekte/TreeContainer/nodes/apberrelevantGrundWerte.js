const apberrelevantGrundWerteNodes = async ({
  data,
  store,
  treeQueryVariables,
}) => {
  const apberrelevantGrundWertes =
    data?.allTpopApberrelevantGrundWertes?.nodes ?? []

  const nodes = apberrelevantGrundWertes.map((el) => ({
    nodeType: 'table',
    menuType: 'tpopApberrelevantGrundWerte',
    filterTable: 'tpopApberrelevantGrundWerte',
    id: el.id,
    parentId: 'tpopApberrelevantGrundWerteFolder',
    urlLabel: el.id,
    label: el.label,
    url: ['Werte-Listen', 'ApberrelevantGrundWerte', el.id],
    hasChildren: false,
  }))

  return nodes
}

export default apberrelevantGrundWerteNodes
