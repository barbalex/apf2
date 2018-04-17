// @flow
import 'leaflet'

export default (store: Object): Array<Object> => {
  const { beobs, highlightedIds } = store.map.beobZugeordnet
  const visible = store.map.activeApfloraLayers.includes(
    'BeobZugeordnetAssignPolylines'
  )
  if (visible) {
    return beobs.map(p => {
      const isHighlighted = highlightedIds.includes(p.id)
      const tpop = store.table.tpop.get(p.tpop_id)
      const tpopKoord =
        tpop && tpop.TPopKoordWgs84 ? tpop.TPopKoordWgs84 : p.KoordWgs84
      const latlngs = [p.KoordWgs84, tpopKoord]

      return window.L.polyline(latlngs, {
        color: isHighlighted ? 'yellow' : '#FF00FF',
      })
    })
  }
  return []
}
