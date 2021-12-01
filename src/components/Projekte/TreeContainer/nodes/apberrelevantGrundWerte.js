const apberrelevantGrundWerteNodes = ({
  nodes: nodesPassed,
  data,
  projektNodes,
}) => {
  const apberrelevantGrundWertes =
    data?.allTpopApberrelevantGrundWertes?.nodes ?? []
  const wlIndex = projektNodes.length + 2
  const nodes = apberrelevantGrundWertes
    // only show if parent node exists
    .filter(() =>
      nodesPassed
        .map((n) => n.id)
        .includes('tpopApberrelevantGrundWerteFolder'),
    )
    .map((el) => ({
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
    .map((el, index) => {
      el.sort = [wlIndex, 2, index]
      return el
    })

  return nodes
}

export default apberrelevantGrundWerteNodes
