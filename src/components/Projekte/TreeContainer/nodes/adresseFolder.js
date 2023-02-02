const adresseFolder = async ({ count, loading, store, treeQueryVariables }) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.adresse ?? ''

  let message = loading && !count ? '...' : count
  if (nodeLabelFilterString) {
    message = `${count} gefiltert`
  }

  return {
    nodeType: 'folder',
    menuType: 'adresseFolder',
    filterTable: 'adresse',
    id: 'adresseFolder',
    urlLabel: 'Adressen',
    label: `Adressen (${message})`,
    url: ['Werte-Listen', 'Adressen'],
    hasChildren: count > 0,
  }
}

export default adresseFolder
