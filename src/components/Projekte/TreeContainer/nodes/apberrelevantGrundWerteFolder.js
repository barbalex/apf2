const apberrelevantGrundWerteFolderNode = async ({ count, loading, store }) => {
  const nodeLabelFilterString =
    store.tree?.nodeLabelFilter?.apberrelevantGrundWerte ?? ''

  let message = loading && !count ? '...' : count
  if (nodeLabelFilterString) {
    message = `${count} gefiltert`
  }

  return {
    nodeType: 'folder',
    menuType: 'tpopApberrelevantGrundWerteFolder',
    filterTable: 'tpopApberrelevantGrundWerte',
    id: 'tpopApberrelevantGrundWerteFolder',
    urlLabel: 'ApberrelevantGrundWerte',
    label: `Teil-Population: Grund für AP-Bericht Relevanz (${message})`,
    url: ['Werte-Listen', 'ApberrelevantGrundWerte'],
    hasChildren: count > 0,
  }
}

export default apberrelevantGrundWerteFolderNode
