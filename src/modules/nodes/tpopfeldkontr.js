import sortBy from 'lodash/sortBy'
import tpopkontrzaehlNodes from './tpopfeldkontrzaehl'

export default ({ store, projId, apArtId, popId, tpopId }) => {
  const { activeUrlElements } = store
  // grab tpopkontr as array and sort them by year
  let tpopkontr = Array.from(store.table.tpopkontr.values())
    .filter(t => t.TPopKontrTyp !== `Freiwilligen-Erfolgskontrolle`)
  // show only nodes of active ap
  tpopkontr = tpopkontr.filter(a => a.TPopId === tpopId)
  // map through all projekt and create array of nodes
  let nodes = tpopkontr.map((el) => {
    const myZaehlNodes = tpopkontrzaehlNodes({ store, projId, apArtId, popId, tpopId, tpopkontrId: el.TPopKontrId })
    return {
      nodeType: `table`,
      menuType: `tpopfeldkontr`,
      id: el.TPopKontrId,
      parentId: tpopId,
      label: `${el.TPopKontrJahr || `(kein Jahr)`}: ${el.TPopKontrTyp || `(kein Typ)`}`,
      expanded: el.TPopKontrId === activeUrlElements.tpopfeldkontr,
      url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Feld-Kontrollen`, el.TPopKontrId],
      children: [
        {
          nodeType: `folder`,
          menuType: `tpopfeldkontrzaehlFolder`,
          id: el.TPopKontrId,
          label: `Zählungen (${myZaehlNodes.length})`,
          expanded: activeUrlElements.tpopfeldkontrzaehlFolder,
          url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Feld-Kontrollen`, el.TPopKontrId, `Zaehlungen`],
          children: myZaehlNodes,
        },
      ],
    }
  })
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`tpopfeldkontr`)
  if (filterString) {
    nodes = nodes.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(nodes, `label`)
}
