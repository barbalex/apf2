// @flow
import clone from 'lodash/clone'
import axios from 'axios'
import { toJS } from 'mobx'

export default async (store: Object, beobId: string): Promise<void> => {
  if (!beobId) {
    return store.listError(new Error('keine beobId übergeben'))
  }
  const tpopbeob = store.table.tpopbeob.get(beobId)
  if (!tpopbeob) {
    return store.listError(
      new Error(`Die Beobachtung mit beobId ${beobId} wurde nicht gefunden`)
    )
  }
  const beob = store.table.beob.get(beobId)
  const { X, Y } = beob
  const tpopId = tpopbeob.tpop_id
  let tpopInStore = store.table.tpop.get(tpopId)
  if (!tpopInStore) {
    return store.listError(
      new Error(`Die Teilpopulation mit tpopId ${tpopId} wurde nicht gefunden`)
    )
  }
  if (!X || !Y) {
    return store.listError(
      new Error(
        'Es wurden keine Koordinaten gefunden. Daher wurden sie nicht in die Teilpopulation kopiert'
      )
    )
  }
  // keep original pop in case update fails
  const originalTpop = clone(tpopInStore)
  tpopInStore.x = X
  tpopInStore.y = Y
  const tpopForDb = clone(toJS(tpopInStore))
  // remove empty values
  Object.keys(tpopForDb).forEach(k => {
    if ((!tpopForDb[k] && tpopForDb[k] !== 0) || tpopForDb[k] === 'undefined') {
      delete tpopForDb[k]
    }
  })
  // remove computed fields that do not exist in db
  delete tpopForDb.label
  delete tpopForDb.popNr
  delete tpopForDb.herkunft
  delete tpopForDb.distance
  delete tpopForDb.TPopKoordWgs84
  delete tpopForDb.ap_id
  // update db
  try {
    await axios.patch(`/tpop?id=eq.${tpopForDb.id}`, tpopForDb)
  } catch (error) {
    tpopInStore = originalTpop
    store.listError(error)
  }
}
