import sortBy from 'lodash/sortBy'
import popmassnberFolderNode from './popmassnberFolder'
import popberFolderNode from './popberFolder'
import tpopFolderNode from './tpopFolder'

export default (store, apArtId) => {
  const { activeUrlElements } = store
  // grab pop as array and sort them by year
  let pop = Array.from(store.table.pop.values())
  // show only nodes of active ap
  pop = pop.filter(a => a.ApArtId === apArtId)
  pop = sortBy(pop, `PopNr`)
  // map through all projekt and create array of nodes
  let nodes = pop.map((el) => {
    const projId = store.table.ap.get(el.ApArtId).ProjId
    return {
      nodeType: `table`,
      menuType: `pop`,
      id: el.PopId,
      parentId: el.ApArtId,
      label: `${el.PopNr || `(keine Nr)`}: ${el.PopName || `(kein Name)`}`,
      expanded: el.PopId === activeUrlElements.pop,
      url: [`Projekte`, projId, `Arten`, el.ApArtId, `Populationen`, el.PopId],
      children: [
        tpopFolderNode(store, projId, el.ApArtId, el.PopId),
        popberFolderNode(store, projId, el.ApArtId, el.PopId),
        popmassnberFolderNode(store, projId, el.ApArtId, el.PopId),
      ],
    }
  })
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`pop`)
  if (filterString) {
    nodes = nodes.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return nodes
}
