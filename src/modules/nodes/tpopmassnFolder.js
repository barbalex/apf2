import tpopmassnNodes from './tpopmassn'

export default ({ store, projId, apArtId, popId, tpopId }) => {
  const { activeUrlElements } = store
  const myTpopmassnNodes = tpopmassnNodes({ store, projId, apArtId, popId, tpopId })
  let message = myTpopmassnNodes.length
  if (store.table.tpopmassnLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`tpopmassn`)) {
    message = `${myTpopmassnNodes.length} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopmassnFolder`,
    id: tpopId,
    label: `Massnahmen (${message})`,
    expanded: activeUrlElements.tpopmassnFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Massnahmen`],
    children: myTpopmassnNodes,
  }
}
