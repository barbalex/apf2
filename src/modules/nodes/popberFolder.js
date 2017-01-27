import popberNodes from './popber'

export default (store, projId, apArtId, popId) => {
  const { activeUrlElements } = store
  const myPopberNodes = popberNodes({ store, apArtId, projId, popId })
  let message = myPopberNodes.length
  if (store.table.popberLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`popber`)) {
    message = `${myPopberNodes.length} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `popberFolder`,
    id: popId,
    label: `Kontroll-Berichte (${message})`,
    expanded: activeUrlElements.popberFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Kontroll-Berichte`],
    children: myPopberNodes,
  }
}
