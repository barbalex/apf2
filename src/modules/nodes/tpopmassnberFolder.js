import tpopmassnberNodes from './tpopmassnber'

export default ({ store, projId, apArtId, popId, tpopId }) => {
  const { activeUrlElements } = store
  const myTpopmassnberNodes = tpopmassnberNodes({ store, projId, apArtId, popId, tpopId })
  let message = myTpopmassnberNodes.length
  if (store.table.tpopmassnberLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`tpopmassnber`)) {
    message = `${myTpopmassnberNodes.length} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopmassnberFolder`,
    id: tpopId,
    label: `Massnahmen-Berichte (${message})`,
    expanded: activeUrlElements.tpopmassnberFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Massnahmen-Berichte`],
    children: myTpopmassnberNodes,
  }
}
