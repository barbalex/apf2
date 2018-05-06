// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

export default (data: Object, projId: number): Array<Object> => {
  const projekte = get(data, 'allProjekts.nodes', [])
  const ap = get(data, 'allAps.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projekte, {
    id: projId,
  })

  // map through all pop and create array of nodes
  return ap.filter(n => n.proj_id === projId).map((el, index) => ({
    nodeType: 'table',
    menuType: 'ap',
    id: el.id,
    parentId: el.proj_id,
    urlLabel: el.id,
    label: el.label,
    url: ['Projekte', el.proj_id, 'Aktionspläne', el.id],
    sort: [projIndex, 1, index],
    hasChildren: true,
  }))
}
