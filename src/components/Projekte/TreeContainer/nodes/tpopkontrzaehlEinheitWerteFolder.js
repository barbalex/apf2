import tpopkontrzaehlEinheitWerte from './tpopkontrzaehlEinheitWerte'

const tpopkontrzaehlEinheitWerteFolderNode = async ({
  count,
  loading,
  store,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString =
    store.tree?.nodeLabelFilter?.tpopkontrzaehlEinheitWerte ?? ''

  let message = loading && !count ? '...' : count
  if (nodeLabelFilterString) {
    message = `${count} gefiltert`
  }

  const showChildren =
    store.tree.openNodes.filter(
      (n) => n[0] === 'Werte-Listen' && n[1] === 'TpopkontrzaehlEinheitWerte',
    ).length > 0

  let children = []

  if (showChildren) {
    const adresseNodes = await tpopkontrzaehlEinheitWerte({
      store,
      treeQueryVariables,
    })
    children = adresseNodes
  }

  return {
    nodeType: 'folder',
    menuType: 'tpopkontrzaehlEinheitWerteFolder',
    id: 'tpopkontrzaehlEinheitWerteFolder',
    urlLabel: 'TpopkontrzaehlEinheitWerte',
    label: `Teil-Population: Zähl-Einheiten (${message})`,
    url: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte'],
    hasChildren: count > 0,
    children,
  }
}

export default tpopkontrzaehlEinheitWerteFolderNode
