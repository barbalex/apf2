import uniq from 'lodash/uniq'

export default (store: Object, tree: Object): Object => {
  const { table } = store
  const { nodeLabelFilter } = tree
  // grab ziele as array
  let ziele = Array.from(table.ziel.values())

  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get(`ziel`)
  const zieltypWerte = Array.from(table.ziel_typ_werte.values())
  if (filterString) {
    ziele = ziele.filter(p => {
      const zielWert = zieltypWerte.find(e => e.ZieltypId === p.ZielTyp)
      const zieltypTxt = zielWert ? zielWert.ZieltypTxt : `kein Zieltyp`
      const label = `${p.ZielBezeichnung || `(kein Ziel)`} (${zieltypTxt})`
      return label.toLowerCase().includes(filterString.toLowerCase())
    })
  }
  if (ziele.length > 0) {
    const zielJahrWerte = uniq(ziele.map(z => z.ZielJahr)).sort()
    const zielJahreObjects = zielJahrWerte.map(z => ({
      jahr: z,
      length: ziele.filter(zj => zj.ZielJahr === z).length
    }))
    return zielJahreObjects
  }
  return []
}
