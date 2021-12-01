const tpopkontrzaehlEinheitWerteNodes = ({
  nodes: nodesPassed,
  data,
  projektNodes,
}) => {
  const tpopkontrzaehlEinheitWertes =
    data?.allTpopkontrzaehlEinheitWertes?.nodes ?? []
  const wlIndex = projektNodes.length + 2
  const nodes = tpopkontrzaehlEinheitWertes
    // only show if parent node exists
    .filter(() =>
      nodesPassed.map((n) => n.id).includes('tpopkontrzaehlEinheitWerteFolder'),
    )
    .map((el) => ({
      nodeType: 'table',
      menuType: 'tpopkontrzaehlEinheitWerte',
      filterTable: 'tpopkontrzaehlEinheitWerte',
      id: el.id,
      parentId: 'tpopkontrzaehlEinheitWerteFolder',
      urlLabel: el.id,
      label: el.label,
      url: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte', el.id],
      hasChildren: false,
    }))
    .map((el, index) => {
      el.sort = [wlIndex, 4, index]
      return el
    })

  return nodes
}

export default tpopkontrzaehlEinheitWerteNodes
