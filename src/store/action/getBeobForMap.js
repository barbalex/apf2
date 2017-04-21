// @flow
import clone from 'lodash/clone'

import epsg21781to4326 from '../../modules/epsg21781to4326'

export default (store: Object): Array<Object> => {
  const { table, tree } = store
  const myApArtId = tree.activeNodes.ap
  // get beob of this ap
  let beob = Array.from(table.beob.values()).filter(
    beob => beob.ArtId === myApArtId
  )

  return beob
    .map(bb => {
      const b = clone(bb)
      // add KoordWgs84
      b.KoordWgs84 = epsg21781to4326(b.X, b.Y)
      // add beobzuordnung
      b.beobzuordnung = table.beobzuordnung.get(b.BeobId)
      return b
    })
    .filter(b => !!b.KoordWgs84)
}
