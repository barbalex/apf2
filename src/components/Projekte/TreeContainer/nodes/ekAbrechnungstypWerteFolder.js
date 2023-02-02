import ekAbrechnungstypWert from './ekAbrechnungstypWerte'

const ekAbrechnungstypWerteFolderNode = async ({
  count,
  loading,
  store,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString =
    store.tree?.nodeLabelFilter?.ekAbrechnungstypWerte ?? ''

  let message = loading && !count ? '...' : count
  if (nodeLabelFilterString) {
    message = `${count} gefiltert`
  }

  const showChildren =
    store.tree.openNodes.filter(
      (n) => n[0] === 'Werte-Listen' && n[1] === 'EkAbrechnungstypWerte',
    ).length > 0

  let children = []

  if (showChildren) {
    const adresseNodes = await ekAbrechnungstypWert({
      store,
      treeQueryVariables,
    })
    children = adresseNodes
  }

  return {
    nodeType: 'folder',
    menuType: 'ekAbrechnungstypWerteFolder',
    id: 'ekAbrechnungstypWerteFolder',
    urlLabel: 'EkAbrechnungstypWerte',
    label: `Teil-Population: EK-Abrechnungstypen (${message})`,
    url: ['Werte-Listen', 'EkAbrechnungstypWerte'],
    hasChildren: count > 0,
    children,
  }
}

export default ekAbrechnungstypWerteFolderNode
