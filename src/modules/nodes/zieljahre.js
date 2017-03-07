import findIndex from 'lodash/findIndex'
import uniq from 'lodash/uniq'
import sortBy from 'lodash/sortBy'

export default (store) => {
  const { activeUrlElements, table, node } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(table.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(table.filteredAndSorted.ap, { ApArtId: apArtId })

  // grab ziele as array
  let ziele = Array.from(table.ziel.values())
  // show only nodes of active ap
  ziele = ziele.filter(a => a.ApArtId === activeUrlElements.ap)
  // filter by node.nodeLabelFilter
  const filterString = node.nodeLabelFilter.get(`ziel`)
  const zieltypWerte = Array.from(table.ziel_typ_werte.values())
  if (filterString) {
    ziele = ziele.filter((p) => {
      const zielWert = zieltypWerte.find(e => e.ZieltypId === p.ZielTyp)
      const zieltypTxt = zielWert ? zielWert.ZieltypTxt : `kein Zieltyp`
      const label = `${p.ZielBezeichnung || `(kein Ziel)`} (${zieltypTxt})`
      return label.toLowerCase().includes(filterString.toLowerCase())
    })
  }

  const nodes = table.filteredAndSorted.zieljahr.map((jahr, index) => {
    const sort = [projIndex, 1, apIndex, 2, index]
    // get nr of ziele for year
    const nrOfZieleThisYear = ziele.filter(z => z.ZielJahr === jahr).length

    return {
      nodeType: `folder`,
      menuType: `zieljahr`,
      id: apArtId,
      parentId: apArtId,
      label: `${jahr == null ? `kein Jahr` : jahr} (${nrOfZieleThisYear})`,
      expanded: jahr && jahr === activeUrlElements.zieljahr,
      url: [`Projekte`, projId, `Arten`, apArtId, `AP-Ziele`, jahr],
      level: 5,
      sort,
      childrenLength: 0,
    }
  })
  return nodes
}
