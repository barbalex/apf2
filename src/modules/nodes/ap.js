import sortBy from 'lodash/sortBy'
import zieljahreFolderNode from './zieljahreFolder'
import erfkritFolderNode from './erfkritFolder'
import apberFolderNode from './apberFolder'
import berFolderNode from './berFolder'
import assozartFolderNode from './assozartFolder'
import popFolderNode from './popFolder'
import idealbiotopFolderNode from './idealbiotopFolder'
import beobzuordnungFolderNode from './beobzuordnungFolder'
import beobNichtZuzuordnenFolderNode from './beobNichtZuzuordnenFolder'
import qkFolderNode from './qkFolder'

export default (store, projId) => {
  const { activeUrlElements } = store
  // grab ape as array and sort them by name
  let ap = Array.from(store.table.ap.values())
  // show only ap of active projekt
  ap = ap.filter(a => a.ProjId === projId)
  // filter by node.apFilter
  if (store.node.apFilter) {
    // ApStatus between 3 and 5
    ap = ap.filter(a => [1, 2, 3].includes(a.ApStatus))

  }
  // map through all ap and create array of nodes
  let nodes = ap.map((el) => {
    let label = `...`
    const { adb_eigenschaften } = store.table
    if (adb_eigenschaften.size > 0) {
      const ae = adb_eigenschaften.get(el.ApArtId)
      label = ae ? ae.Artname : `(keine Art gewählt)`
    }
    return {
      nodeType: `table`,
      menuType: `ap`,
      id: el.ApArtId,
      parentId: el.ProjId,
      label,
      expanded: el.ApArtId === activeUrlElements.ap,
      url: [`Projekte`, el.ProjId, `Arten`, el.ApArtId],
      children: [
        popFolderNode(store, el.ProjId, el.ApArtId),
        zieljahreFolderNode(store, el.ProjId, el.ApArtId),
        erfkritFolderNode(store, el.ProjId, el.ApArtId),
        apberFolderNode(store, el.ProjId, el.ApArtId),
        berFolderNode(store, el.ProjId, el.ApArtId),
        beobzuordnungFolderNode(store, el.ProjId, el.ApArtId),
        beobNichtZuzuordnenFolderNode(store, el.ProjId, el.ApArtId),
        idealbiotopFolderNode(store, el.ProjId, el.ApArtId),
        assozartFolderNode(store, el.ProjId, el.ApArtId),
        qkFolderNode(store, el.ProjId, el.ApArtId),
      ],
    }
  })
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`ap`)
  if (filterString) {
    nodes = nodes.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(nodes, `label`)
}
