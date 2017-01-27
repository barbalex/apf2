import tpopbeobNodes from './tpopbeob'

export default ({ store, projId, apArtId, popId, tpopId }) => {
  const { activeUrlElements } = store
  const myTpopbeobNodes = tpopbeobNodes({ store, projId, apArtId, popId, tpopId })
  let message = myTpopbeobNodes.length
  if (store.table.beobzuordnungLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`tpopbeob`)) {
    message = `${myTpopbeobNodes.length} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopbeobFolder`,
    id: tpopId,
    label: `Beobachtungen (${message})`,
    expanded: activeUrlElements.tpopbeobFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Beobachtungen`],
    children: myTpopbeobNodes,
  }
}
