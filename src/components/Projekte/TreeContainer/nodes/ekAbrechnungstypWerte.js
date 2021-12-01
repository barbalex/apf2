const ekAbrechnungstypWerteNodes = ({
  nodes: nodesPassed,
  data,
  projektNodes,
}) => {
  const ekAbrechnungstypWertes = data?.allEkAbrechnungstypWertes?.nodes ?? []
  const wlIndex = projektNodes.length + 2
  const nodes = ekAbrechnungstypWertes
    // only show if parent node exists
    .filter(() =>
      nodesPassed.map((n) => n.id).includes('ekAbrechnungstypWerteFolder'),
    )
    .map((el) => ({
      nodeType: 'table',
      menuType: 'ekAbrechnungstypWerte',
      filterTable: 'ekAbrechnungstypWerte',
      id: el.id,
      parentId: 'ekAbrechnungstypWerteFolder',
      urlLabel: el.id,
      label: el.label,
      url: ['Werte-Listen', 'EkAbrechnungstypWerte', el.id],
      hasChildren: false,
    }))
    .map((el, index) => {
      el.sort = [wlIndex, 3, index]
      return el
    })

  return nodes
}

export default ekAbrechnungstypWerteNodes
