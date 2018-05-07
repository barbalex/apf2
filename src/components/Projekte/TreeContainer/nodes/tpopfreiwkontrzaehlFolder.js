import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

export default ({
  data,
  tree,
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
}: {
  data: Object,
  tree: Object,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  popNodes: Array<Object>,
  tpopNodes: Array<Object>,
  tpopfreiwkontrNodes: Array<Object>,
  projId: String,
  apId: String,
  popId: String,
  tpopId: String,
  tpopkontrId: String,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })
  const tpopkontrIndex = findIndex(tpopfreiwkontrNodes, { id: tpopkontrId })
  const nodeLabelFilterString = tree.nodeLabelFilter.get('tpopkontrzaehl')

  const childrenLength = get(data, 'tpopkontrzaehls.nodes', [])
    .filter(el => el.tpopkontrId === tpopkontrId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${get(
          el,
          'tpopkontrzaehlEinheitWerteByEinheit.text',
          '(keine Einheit)'
        )}: ${el.anzahl} ${get(
          el,
          'tpopkontrzaehlMethodeWerteByMethode.text',
          '(keine Methode)'
        )}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length

  let message = childrenLength
  if (tree.nodeLabelFilter.get('tpopkontrzaehl')) {
    message = `${childrenLength} gefiltert`
  }
  console.log('tpopfreiwkontrzaehlFolder:', { tpopkontrId })

  return [
    {
      nodeType: 'folder',
      menuType: 'tpopfeldkontrzaehlFolder',
      id: tpopkontrId,
      urlLabel: 'Zaehlungen',
      label: `Zählungen (${message})`,
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
      ],
      sort: [
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
      ],
      hasChildren: childrenLength > 0,
    },
  ]
}
