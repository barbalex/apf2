// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apId: number,
  zieljahr: number,
  zielId: number
): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    id: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.proj_id === projId),
    { id: apId }
  )
  const zieljahrIndex = findIndex(tree.filteredAndSorted.zieljahr, {
    jahr: zieljahr,
  })
  const zielIndex = findIndex(
    tree.filteredAndSorted.ziel.filter(z => z.jahr === zieljahr),
    { id: zielId }
  )
  const zielIsVisible = !!tree.filteredAndSorted.ziel.filter(
    z => z.jahr === zieljahr && z.id === zielId
  )

  // prevent folder from showing when nodeFilter is set
  if (!zielIsVisible) return []

  const zielberNodesLength = tree.filteredAndSorted.zielber.filter(
    z => z.ziel_id === zielId
  ).length

  let message = zielberNodesLength
  if (store.table.zielberLoading) {
    message = '...'
  }
  if (store.tree.nodeLabelFilter.get('zielber')) {
    message = `${zielberNodesLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'zielberFolder',
      id: zielId,
      urlLabel: 'Berichte',
      label: `Berichte (${message})`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'AP-Ziele',
        zieljahr,
        zielId,
        'Berichte',
      ],
      sort: [projIndex, 1, apIndex, 2, zieljahrIndex, zielIndex, 1],
      hasChildren: zielberNodesLength > 0,
    },
  ]
}
