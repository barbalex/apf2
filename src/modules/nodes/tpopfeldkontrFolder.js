import tpopfeldkontrNodes from './tpopfeldkontr'

export default ({ store, projId, apArtId, popId, tpopId }) => {
  const { activeUrlElements } = store
  const myTpopfeldkontrNodes = tpopfeldkontrNodes({ store, projId, apArtId, popId, tpopId })
  let message = myTpopfeldkontrNodes.length
  if (store.table.tpopkontrLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`tpopfeldkontr`)) {
    message = `${myTpopfeldkontrNodes.length} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopfeldkontrFolder`,
    id: tpopId,
    label: `Feld-Kontrollen (${message})`,
    expanded: activeUrlElements.tpopfeldkontrFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Feld-Kontrollen`],
    children: myTpopfeldkontrNodes,
  }
}
