const ekAbrechnungstypWerteFolderNode = ({
  nodes: nodesPassed,
  data,
  loading,
  projektNodes,
  store,
}) => {
  const ekAbrechnungstypWertes = data?.allEkAbrechnungstypWertes?.nodes ?? []
  const wlIndex = projektNodes.length + 2
  const nodeLabelFilterString =
    store.tree?.nodeLabelFilter?.ekAbrechnungstypWerte ?? ''

  let ekAbrechnungstypWerteNodesLength = ekAbrechnungstypWertes.length
  // before EkAbrechnungstypWerte folder is active, only total count was fetched, not yet any ekAbrechnungstypWerten nodes
  if (ekAbrechnungstypWertes.length === 0)
    ekAbrechnungstypWerteNodesLength =
      data?.ekAbrechnungstypWertesUnfiltered?.totalCount
  let message =
    loading && !ekAbrechnungstypWerteNodesLength
      ? '...'
      : ekAbrechnungstypWerteNodesLength
  if (nodeLabelFilterString) {
    message = `${ekAbrechnungstypWerteNodesLength} gefiltert`
  }

  // only show if parent node exists
  if (!nodesPassed.map((n) => n.id).includes('wlFolder')) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'ekAbrechnungstypWerteFolder',
      filterTable: 'ekAbrechnungstypWerte',
      id: 'ekAbrechnungstypWerteFolder',
      urlLabel: 'EkAbrechnungstypWerte',
      label: `Teil-Population: EK-Abrechnungstypen (${message})`,
      url: ['Werte-Listen', 'EkAbrechnungstypWerte'],
      sort: [wlIndex, 3],
      hasChildren: ekAbrechnungstypWerteNodesLength > 0,
    },
  ]
}

export default ekAbrechnungstypWerteFolderNode
