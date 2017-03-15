// @flow
import clone from 'lodash/clone'

import epsg21781to4326 from './epsg21781to4326'

export default (store:Object) => {
  const { table, activeUrlElements } = store
  const myApArtId = activeUrlElements.ap
  // get beob of this ap
  let beob = Array.from(table.beob_bereitgestellt.values())
    .filter(beob => beob.NO_ISFS === myApArtId)

  return beob.map((bb) => {
    const b = clone(bb)
    // add original beobachtung
    b.beob = (
      b.QuelleId === 1 ?
      table.beob_evab.get(b.BeobId) :
      table.beob_infospezies.get(b.BeobId)
    )
    // add beobzuordnung
    b.beobzuordnung = table.beobzuordnung.get(b.BeobId)
    if (b.beob) {
      // add KoordWgs84
      b.KoordWgs84 = (
        b.QuelleId === 1 ?
        epsg21781to4326(b.beob.COORDONNEE_FED_E, b.beob.COORDONNEE_FED_N) :
        epsg21781to4326(b.beob.FNS_XGIS, b.beob.FNS_YGIS)
      )
    }
    return b
  }).filter(b => !!b.KoordWgs84)
}
