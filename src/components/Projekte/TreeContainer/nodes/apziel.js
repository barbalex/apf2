import apzielberFolder from './apzielberFolder'

const apzielNodes = async ({
  projId,
  apId,
  jahr,
  ziels,
  store,
  treeQueryVariables,
}) => {
  const nodes = []

  for (const el of ziels) {
    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 7 &&
          n[1] === projId &&
          n[3] === apId &&
          n[4] === 'AP-Ziele' &&
          n[5] === jahr &&
          n[6] === el.id,
      ).length > 0

    const children = isOpen
      ? await apzielberFolder({
          projId,
          apId,
          store,
          zielId: el.id,
          ziels: ziels.filter((z) => z.jahr === jahr),
          jahr,
          treeQueryVariables,
        })
      : []

    nodes.push({
      nodeType: 'table',
      menuType: 'ziel',
      id: el.id,
      parentId: apId,
      parentTableId: apId,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projId, 'Arten', apId, 'AP-Ziele', el.jahr, el.id],
      hasChildren: true,
      children,
    })
  }

  return nodes
}

export default apzielNodes
