import apberrelevantGrundWerte from './apberrelevantGrundWerte'

const apberrelevantGrundWerteFolderNode = async ({
  count,
  loading,
  store,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString =
    store.tree?.nodeLabelFilter?.apberrelevantGrundWerte ?? ''

  let message = loading && !count ? '...' : count
  if (nodeLabelFilterString) {
    message = `${count} gefiltert`
  }

  const showChildren =
    store.tree.openNodes.filter(
      (n) => n[0] === 'Werte-Listen' && n[1] === 'ApberrelevantGrundWerte',
    ).length > 0

  let children = []

  if (showChildren) {
    const adresseNodes = await apberrelevantGrundWerte({
      store,
      treeQueryVariables,
    })
    children = adresseNodes
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
    children,
  }
}

export default apberrelevantGrundWerteFolderNode
