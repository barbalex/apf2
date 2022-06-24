import findIndex from 'lodash/findIndex'

const tpopfeldkontrzaehlNodes = ({
  nodes: nodesPassed,
  data,
  projektNodes,
  apNodes,
  popNodes,
  tpopNodes,
  tpopfeldkontrNodes,
  projId,
  apId,
  popId,
  tpopId,
  tpopkontrId,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })
  const tpopkontrIndex = findIndex(tpopfeldkontrNodes, { id: tpopkontrId })

  // map through all elements and create array of nodes
  const nodes = (data?.allTpopkontrzaehls?.nodes ?? [])
    // only show if parent node exists
    .filter((el) =>
      nodesPassed
        .map((n) => n.id)
        .includes(`${el.tpopkontrId}TpopfeldkontrzaehlFolder`),
    )
    // only show nodes of this parent
    .filter((el) => el.tpopkontrId === tpopkontrId)
    .map((el) => ({
      nodeType: 'table',
      menuType: 'tpopfeldkontrzaehl',
      filterTable: 'tpopkontrzaehl',
      id: el.id,
      parentId: `${el.tpopkontrId}TpopfeldkontrzaehlFolder`,
      parentTableId: el.tpopkontrId,
      urlLabel: el.id,
      label: el.label,
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
        tpopkontrId,
        'Zaehlungen',
        el.id,
      ],
      hasChildren: false,
    }))
    .map((el, index) => {
      el.sort = [
        projIndex,
        1,
        apIndex,
        1,
        popIndex,
        1,
        tpopIndex,
        3,
        tpopkontrIndex,
        1,
        index,
      ]
      return el
    })

  return nodes
}

export default tpopfeldkontrzaehlNodes
