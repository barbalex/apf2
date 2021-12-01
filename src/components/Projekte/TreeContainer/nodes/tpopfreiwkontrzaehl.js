import findIndex from 'lodash/findIndex'

import exists from '../../../../modules/exists'

const tpopfreiwkontrzaehlNodes = ({
  nodes: nodesPassed,
  data,
  projektNodes,
  apNodes,
  popNodes,
  tpopNodes,
  tpopfreiwkontrNodes,
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
  const tpopkontrIndex = findIndex(tpopfreiwkontrNodes, { id: tpopkontrId })

  // map through all elements and create array of nodes
  const nodes = (data?.allTpopkontrzaehls?.nodes ?? [])
    // only show if parent node exists
    .filter((el) =>
      nodesPassed
        .map((n) => n.id)
        .includes(`${el.tpopkontrId}TpopfreiwkontrzaehlFolder`),
    )
    // only show nodes of this parent
    .filter((el) => el.tpopkontrId === tpopkontrId && exists(el.anzahl))
    .map((el) => ({
      nodeType: 'table',
      menuType: 'tpopfreiwkontrzaehl',
      filterTable: 'tpopkontrzaehl',
      id: el.id,
      parentId: `${el.tpopkontrId}TpopfreiwkontrzaehlFolder`,
      parentTableId: el.tpopkontrId,
      urlLabel: el.id,
      label: el.label,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Freiwilligen-Kontrollen',
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
        4,
        tpopkontrIndex,
        1,
        index,
      ]
      return el
    })

  return nodes
}

export default tpopfreiwkontrzaehlNodes
