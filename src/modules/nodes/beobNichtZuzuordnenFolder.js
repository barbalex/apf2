import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, table } = store

  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.table.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(store.table.filteredAndSorted.ap, { ApArtId: apArtId })

  const beobNichtZuzuordnenNodesLength = table.filteredAndSorted.beobNichtZuzuordnen.length

  let message = beobNichtZuzuordnenNodesLength
  if (store.loading.includes(`beobzuordnung`)) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`beobNichtZuzuordnen`)) {
    message = `${beobNichtZuzuordnenNodesLength} gefiltert`
  }
  const sort = [projIndex, 1, apIndex, 9]

  return {
    nodeType: `folder`,
    menuType: `beobNichtZuzuordnenFolder`,
    id: apArtId,
    label: `Beobachtungen nicht zuzuordnen (${message})`,
    expanded: activeUrlElements.beobNichtZuzuordnenFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `nicht-zuzuordnende-Beobachtungen`],
    level: 4,
    sort,
    childrenLength: beobNichtZuzuordnenNodesLength,
  }
}
