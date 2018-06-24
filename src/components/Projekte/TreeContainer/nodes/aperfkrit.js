// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

export default ({
  data,
  treeName,
  projektNodes,
  apNodes,
  projId,
  apId,
}: {
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  projId: String,
  apId: String,
}): Array < Object > => {
  const erfkrits = get(data, 'erfkrits.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId
  })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.erfkrit`)

  // map through all elements and create array of nodes
  const nodes = erfkrits
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${get(
          el,
          'apErfkritWerteByErfolg.text',
          '(nicht beurteilt)'
        )}: ${el.kriterien || '(keine Kriterien erfasst)'}`.includes(
          nodeLabelFilterString.toLowerCase()
        )
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'erfkrit',
      id: el.id,
      parentId: el.apId,
      urlLabel: el.id,
      label: `${get(
        el,
        'apErfkritWerteByErfolg.text',
        '(nicht beurteilt)'
      )}: ${el.kriterien || '(keine Kriterien erfasst)'}`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        el.apId,
        'AP-Erfolgskriterien',
        el.id,
      ],
      hasChildren: false,
    }))
    // sort by label
    .sort(
      (a, b) =>
      get(b, 'apErfkritWerteByErfolg.sort', 0) -
      get(a, 'apErfkritWerteByErfolg.sort', 0)
    )
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 3, index]
      return el
    })

  return nodes
}