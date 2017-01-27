import sortBy from 'lodash/sortBy'
import zielberFolderNode from './zielberFolder'

export default (store, jahr) => {
  const { activeUrlElements } = store
  // grab ziele as array
  let ziele = Array.from(store.table.ziel.values())
  // show only nodes of active ap
  const activeAp = store.activeUrlElements.ap
  ziele = ziele.filter(a => a.ApArtId === activeAp)
  // show only nodes of active zieljahr
  ziele = ziele.filter((a) => {
    if (jahr === null || jahr === undefined) {
      return a.ZielJahr !== 0 && !a.ZielJahr
    }
    return a.ZielJahr === jahr
  })
  // get zielWerte
  const zieltypWerte = Array.from(store.table.ziel_typ_werte.values())
  // map through all and create array of nodes
  let nodes = ziele.map((el) => {
    const projId = store.table.ap.get(el.ApArtId).ProjId
    const zielWert = zieltypWerte.find(e => e.ZieltypId === el.ZielTyp)
    const zieltypTxt = zielWert ? zielWert.ZieltypTxt : `kein Zieltyp`
    return {
      nodeType: `table`,
      menuType: `ziel`,
      id: el.ZielId,
      parentId: el.ApArtId,
      label: `${el.ZielBezeichnung || `(kein Ziel)`} (${zieltypTxt})`,
      expanded: el.ZielId === activeUrlElements.ziel,
      url: [`Projekte`, projId, `Arten`, el.ApArtId, `AP-Ziele`, el.ZielJahr, el.ZielId],
      children: [
        zielberFolderNode(store, projId, el.ApArtId, el.ZielJahr, el.ZielId),
      ],
    }
  })
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`ziel`)
  if (filterString) {
    nodes = nodes.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(nodes, `label`)
}
