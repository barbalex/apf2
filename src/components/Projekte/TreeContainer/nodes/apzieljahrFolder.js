import apziel from './apziel'

const apzieljahrFolderNode = async ({
  ziels,
  projId,
  apId,
  store,
  zieljahre = [],
}) => {
  const nodes = []
  for (const jahr of zieljahre) {
    const labelJahr = jahr === null || jahr === undefined ? 'kein Jahr' : jahr
    const zieleOfJahr = ziels.filter((el) => el.jahr === jahr)
    const labelJahreLength = zieleOfJahr.length

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 5 &&
          n[1] === projId &&
          n[3] === apId &&
          n[4] === 'AP-Ziele' &&
          n[5] === jahr,
      ).length > 0

    const children = isOpen
      ? await apziel({
          projId,
          apId,
          store,
          ziels: ziels.filter((z) => z.jahr === jahr),
        })
      : []

    nodes.push({
      nodeType: 'folder',
      menuType: 'zieljahrFolder',
      filterTable: 'ziel',
      id: `${apId}Ziele${jahr || 'keinJahr'}`,
      jahr,
      parentId: apId,
      urlLabel: `${jahr === null || jahr === undefined ? 'kein Jahr' : jahr}`,
      label: `${labelJahr} (${labelJahreLength})`,
      url: ['Projekte', projId, 'Arten', apId, 'AP-Ziele', jahr],
      hasChildren: true,
      children,
    })
  }

  return nodes
}

export default apzieljahrFolderNode
