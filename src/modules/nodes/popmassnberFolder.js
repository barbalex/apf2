import popmassnberNodes from './popmassnber'

export default (store, projId, apArtId, popId) => {
  const { activeUrlElements } = store
  const myPopmassnberNodes = popmassnberNodes({ store, apArtId, projId, popId })
  let message = myPopmassnberNodes.length
  if (store.table.popmassnberLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`popmassnber`)) {
    message = `${myPopmassnberNodes.length} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `popmassnberFolder`,
    id: popId,
    label: `Massnahmen-Berichte (${message})`,
    expanded: activeUrlElements.popmassnberFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Massnahmen-Berichte`],
    children: myPopmassnberNodes,
  }
}
