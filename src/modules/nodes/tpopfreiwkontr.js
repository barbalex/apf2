import sortBy from 'lodash/sortBy'
import tpopkontrzaehlNodes from './tpopfreiwkontrzaehl'

export default ({ store, projId, apArtId, popId, tpopId }) => {
  const { activeUrlElements } = store
  // grab tpopkontr as array and sort them by year
  let tpopkontr = Array.from(store.table.tpopkontr.values())
    .filter(t => t.TPopKontrTyp === `Freiwilligen-Erfolgskontrolle`)
  // show only nodes of active ap
  tpopkontr = tpopkontr.filter(a => a.TPopId === tpopId)
  // map through all projekt and create array of nodes
  let nodes = tpopkontr.map((el) => {
    const myZaehlNodes = tpopkontrzaehlNodes({ store, projId, apArtId, popId, tpopId, tpopkontrId: el.TPopKontrId })
    return {
      nodeType: `table`,
      menuType: `tpopfreiwkontr`,
      id: el.TPopKontrId,
      parentId: tpopId,
      label: `${el.TPopKontrJahr || `(kein Jahr)`}`,
      expanded: el.TPopKontrId === activeUrlElements.tpopfreiwkontr,
      url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Freiwilligen-Kontrollen`, el.TPopKontrId],
      children: [
        {
          nodeType: `folder`,
          menuType: `tpopfreiwkontrzaehlFolder`,
          id: el.TPopKontrId,
          label: `Zählungen (${myZaehlNodes.length})`,
          expanded: activeUrlElements.tpopfreiwkontrzaehlFolder,
          url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Freiwilligen-Kontrollen`, el.TPopKontrId, `Zaehlungen`],
          children: myZaehlNodes,
        },
      ],
    }
  })
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`tpopfreiwkontr`)
  if (filterString) {
    nodes = nodes.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(nodes, `label`)
}
