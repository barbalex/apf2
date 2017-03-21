/**
 * gets a latLng wgs 84
 * returns tpopId of nearest tpop
 */
import nearest from '@turf/nearest'

export default (store, latLng) => {
  const { table, activeUrlElements } = store
  const { lat, lng } = latLng
  const point = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": [lat, lng]
    }
  }
  const popIds = Array.from(table.pop.values())
    .filter(p => p.ApArtId === activeUrlElements.ap)
    .map(p => p.PopId)
  const tpopFeatures = Array.from(table.tpop.values())
    .filter(t => popIds.includes(t.PopId))
    .filter(t => t.TPopKoordWgs84)
    .map(t => ({
      "type": "Feature",
      "properties": {
        "TPopId": t.TPopId
      },
      "geometry": {
        "type": "Point",
        "coordinates": t.TPopKoordWgs84
      }
    }))
  const against = {
  "type": "FeatureCollection",
    "features": tpopFeatures
  }
  const nearestTpopFeature = nearest(point, against)
  return nearestTpopFeature.properties.TPopId
}
