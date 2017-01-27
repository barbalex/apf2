import zieljahreNodes from './zieljahre'

export default (store, projId, apArtId) => {
  const { activeUrlElements } = store
  const myZieljahreNodes = zieljahreNodes(store, apArtId)
  let message = `${myZieljahreNodes.length} Jahre`
  if (store.table.zielLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`ziel`)) {
    const jahreTxt = myZieljahreNodes.length === 1 ? `Jahr` : `Jahre`
    message = `${myZieljahreNodes.length} ${jahreTxt} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `zielFolder`,
    id: apArtId,
    label: `AP-Ziele (${message})`,
    expanded: activeUrlElements.zielFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `AP-Ziele`],
    children: myZieljahreNodes,
  }
}
