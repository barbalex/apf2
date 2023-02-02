import adresse from './adresse'

const adresseFolder = async ({ count, loading, store, treeQueryVariables }) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.adresse ?? ''

  let message = loading && !count ? '...' : count
  if (nodeLabelFilterString) {
    message = `${count} gefiltert`
  }

  const showChildren =
    store.tree.openNodes.filter(
      (n) => n[0] === 'Werte-Listen' && n[1] === 'Adressen',
    ).length > 0

  let children = []

  if (showChildren) {
    const adresseNodes = await adresse({ store, treeQueryVariables })
    children = adresseNodes
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
    children,
  }
}

export default adresseFolder
