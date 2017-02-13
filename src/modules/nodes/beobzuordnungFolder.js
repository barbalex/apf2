import beobzuordnungNodes from './beobzuordnung'

export default (store, projId, apArtId) => {
  const { activeUrlElements } = store
  const myBeobzuordnungNodes = beobzuordnungNodes(store, apArtId)
  let message = myBeobzuordnungNodes.length
  if (store.loading.includes(`beob_bereitgestellt`)) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`beobzuordnung`)) {
    message = `${myBeobzuordnungNodes.length} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `beobzuordnungFolder`,
    id: apArtId,
    label: `nicht beurteilte Beobachtungen (${message})`,
    expanded: activeUrlElements.beobzuordnungFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `nicht-beurteilte-Beobachtungen`],
    children: myBeobzuordnungNodes,
  }
}
