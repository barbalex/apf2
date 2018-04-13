// @flow
/**
 * gets a latLng wgs 84
 * returns tpopId of nearest tpop
 */
import nearest from '@turf/nearest'

export default (store: Object, latLng: Object): number => {
  const { table, tree } = store
  const { activeNodes } = tree
  const { lat, lng } = latLng
  const point = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [lat, lng],
    },
  }
  const popIds = Array.from(table.pop.values())
    .filter(p => p.ap_id === activeNodes.ap)
    .map(p => p.id)
  const tpopFeatures = Array.from(table.tpop.values())
    .filter(t => popIds.includes(t.pop_id))
    .filter(t => t.TPopKoordWgs84)
    .map(t => ({
      type: 'Feature',
      properties: {
        id: t.id,
      },
      geometry: {
        type: 'Point',
        coordinates: t.TPopKoordWgs84,
      },
    }))
  const against = {
    type: 'FeatureCollection',
    features: tpopFeatures,
  }
  const nearestTpopFeature = nearest(point, against)
  return nearestTpopFeature.properties.id
}
