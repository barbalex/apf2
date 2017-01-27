import beobNichtZuzuordnenNodes from './beobNichtZuzuordnen'

export default (store, projId, apArtId) => {
  const { activeUrlElements } = store
  const myBeobNichtZuzuordnenNodes = beobNichtZuzuordnenNodes(store, apArtId)
  let message = myBeobNichtZuzuordnenNodes.length
  if (store.table.beobzuordnungLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`beobNichtZuzuordnen`)) {
    message = `${myBeobNichtZuzuordnenNodes.length} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `beobNichtZuzuordnenFolder`,
    id: apArtId,
    label: `nicht zuzuordnende Beobachtungen (${message})`,
    expanded: activeUrlElements.beobNichtZuzuordnenFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `nicht-zuzuordnende-Beobachtungen`],
    children: myBeobNichtZuzuordnenNodes,
  }
}
