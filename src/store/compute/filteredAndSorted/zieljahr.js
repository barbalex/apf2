import uniq from 'lodash/uniq'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter, activeNodes } = tree
  const apArtId = activeNodes.ap
  // grab ziele as array
  let ziele = Array.from(table.ziel.values())
  ziele = ziele.filter(z => z.ap_id === apArtId)

  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('ziel')
  const zieltypWerte = Array.from(table.ziel_typ_werte.values())
  if (filterString) {
    ziele = ziele.filter(p => {
      const zielWert = zieltypWerte.find(e => e.code === p.typ)
      const zieltypTxt = zielWert ? zielWert.text : 'kein Zieltyp'
      const label = `${p.bezeichnung || '(kein Ziel)'} (${zieltypTxt})`
      return label.toLowerCase().includes(filterString.toLowerCase())
    })
  }
  if (ziele.length > 0) {
    const zielJahrWerte = uniq(ziele.map(z => z.jahr)).sort()
    const zielJahreObjects = zielJahrWerte.map(z => ({
      jahr: z,
      length: ziele.filter(zj => zj.jahr === z).length,
      menuType: 'zieljahr',
    }))
    return zielJahreObjects
  }
  return []
}
