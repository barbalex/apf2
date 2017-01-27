import zielberNodes from './zielber'

export default (store, projId, apArtId, zieljahr, zielId) => {
  const { activeUrlElements } = store
  const myZielberNodes = zielberNodes(store, zielId)
  let message = myZielberNodes.length
  if (store.table.zielberLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`zielber`)) {
    message = `${myZielberNodes.length} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `zielberFolder`,
    id: zielId,
    label: `Berichte (${message})`,
    expanded: zielId === activeUrlElements.ziel && activeUrlElements.zielberFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `AP-Ziele`, zieljahr, zielId, `Berichte`],
    children: myZielberNodes,
  }
}
