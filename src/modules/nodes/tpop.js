import sortBy from 'lodash/sortBy'
import tpopberFolderNode from './tpopberFolder'
import tpopmassnberFolderNode from './tpopmassnberFolder'
import tpopmassnFolderNode from './tpopmassnFolder'
import tpopfeldkontrFolderNode from './tpopfeldkontrFolder'
import tpopfreiwkontrFolderNode from './tpopfreiwkontrFolder'
import tpopbeobFolderNode from './tpopbeobFolder'

export default ({ store, projId, apArtId, popId }) => {
  const { activeUrlElements } = store
  // grab tpop as array and sort them by year
  let tpop = Array.from(store.table.tpop.values())
  // show only nodes of active ap
  tpop = tpop.filter(a => a.PopId === popId)
  tpop = sortBy(tpop, `TPopNr`)
  // map through all projekt and create array of nodes
  let nodes = tpop.map((el) => {
    const tpopId = el.TPopId
    return {
      nodeType: `table`,
      menuType: `tpop`,
      id: el.TPopId,
      parentId: el.PopId,
      label: `${el.TPopNr || `(keine Nr)`}: ${el.TPopFlurname || `(kein Flurname)`}`,
      expanded: el.TPopId === activeUrlElements.tpop,
      url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, el.PopId, `Teil-Populationen`, el.TPopId],
      children: [
        tpopmassnFolderNode({ store, projId, apArtId, popId, tpopId }),
        tpopmassnberFolderNode({ store, projId, apArtId, popId, tpopId }),
        tpopfeldkontrFolderNode({ store, projId, apArtId, popId, tpopId }),
        tpopfreiwkontrFolderNode({ store, projId, apArtId, popId, tpopId }),
        tpopberFolderNode({ store, projId, apArtId, popId, tpopId }),
        tpopbeobFolderNode({ store, projId, apArtId, popId, tpopId }),
      ],
    }
  })
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`tpop`)
  if (filterString) {
    nodes = nodes.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return nodes
}
