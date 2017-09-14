// @flow
import clone from 'lodash/clone'

import epsg21781to4326 from '../../modules/epsg21781to4326'

export default (store: Object): Array<Object> => {
  const { table, tree } = store
  const myApArtId = tree.activeNodes.ap
  // get beobs of this ap
  let beobs = Array.from(table.beob.values()).filter(
    beob => beob.ArtId === myApArtId
  )

  return beobs
    .map(bb => {
      const beob = clone(bb)
      // add KoordWgs84
      beob.KoordWgs84 = epsg21781to4326(beob.X, beob.Y)
      // add beobzuordnung
      beob.beobzuordnung = table.beobzuordnung.get(beob.BeobId)
      return beob
    })
    .filter(beob => !!beob.KoordWgs84)
}
