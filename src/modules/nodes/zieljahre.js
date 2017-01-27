import uniq from 'lodash/uniq'
import sortBy from 'lodash/sortBy'
import buildZielNodes from './ziel'

export default (store, apArtId) => {
  const { activeUrlElements } = store
  // grab ziele as array
  let ziele = Array.from(store.table.ziel.values())
  // show only nodes of active ap
  ziele = ziele.filter(a => a.ApArtId === apArtId)
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`ziel`)
  const zieltypWerte = Array.from(store.table.ziel_typ_werte.values())
  if (filterString) {
    ziele = ziele.filter((p) => {
      const zielWert = zieltypWerte.find(e => e.ZieltypId === p.ZielTyp)
      const zieltypTxt = zielWert ? zielWert.ZieltypTxt : `kein Zieltyp`
      const label = `${p.ZielBezeichnung || `(kein Ziel)`} (${zieltypTxt})`
      return label.toLowerCase().includes(filterString.toLowerCase())
    })
  }
  if (ziele.length > 0) {
    const projId = store.table.ap.get(apArtId).ProjId
    const zielJahre = uniq(ziele.map(z => z.ZielJahr))
    // map through all and create array of nodes
    const nodes = zielJahre.map((jahr) => {
      const zielNodes = buildZielNodes(store, jahr)
      return {
        nodeType: `folder`,
        menuType: `zieljahr`,
        id: apArtId,
        parentId: apArtId,
        label: `${jahr == null ? `kein Jahr` : jahr} (${zielNodes.length})`,
        expanded: jahr && jahr === activeUrlElements.zieljahr,
        url: [`Projekte`, projId, `Arten`, apArtId, `AP-Ziele`, jahr],
        children: zielNodes,
      }
    })
    // sort by label and return
    return sortBy(nodes, `label`)
  }
  return []
}
