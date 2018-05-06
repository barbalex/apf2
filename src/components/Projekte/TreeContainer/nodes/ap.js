// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

const compareLabels = (a, b) => {
  if (a.label.toLowerCase() < b.label.toLowerCase()) {
    return -1
  } else if (a.label.toLowerCase() > b.label.toLowerCase()) {
    return 1
  }
  return 0
}

export default ({
  data,
  tree,
  projId,
}: {
  data: Object,
  tree: Object,
  projId: number,
}): Array<Object> => {
  const { nodeLabelFilter, apFilter } = tree
  const nodeLabelFilterString = nodeLabelFilter.get('ap')
  const projekts = get(data, 'allProjekts.nodes', [])
  const aps = get(data, 'allAps.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projekts, {
    id: projId,
  })

  // map through all elements and create array of nodes
  const nodes = aps
    // filter by projekt
    .filter(el => el.projId === projId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return get(el, 'aeEigenschaftenByArtId.artname', '')
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    // filter by apFilter
    .filter(el => {
      if (apFilter) {
        return [1, 2, 3].includes(el.bearbeitung)
      }
      return true
    })
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'ap',
      id: el.id,
      parentId: el.projId,
      urlLabel: el.id,
      label: get(el, 'aeEigenschaftenByArtId.artname', '(keine Art gewählt)'),
      url: ['Projekte', el.projId, 'Aktionspläne', el.id],
      hasChildren: true,
    }))
    .sort(compareLabels)
    .map((el, index) => {
      el.sort = [projIndex, 1, index]
      return el
    })
  console.log('ap: nodes:', nodes)
  return nodes
}
