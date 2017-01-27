import apberuebersichtNodes from './apberuebersicht'

export default (store, projId) => {
  const { activeUrlElements } = store
  const myApberuebersichtnodes = apberuebersichtNodes(store, projId)
  let message = myApberuebersichtnodes.length
  if (store.table.apberuebersichtLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`apberuebersicht`)) {
    message = `${myApberuebersichtnodes.length} gefiltert`
  }

  return {
    menuType: `apberuebersichtFolder`,
    id: projId,
    label: `AP-Berichte (${message})`,
    expanded: activeUrlElements.apberuebersichtFolder,
    url: [`Projekte`, projId, `AP-Berichte`],
    children: myApberuebersichtnodes,
  }
}
