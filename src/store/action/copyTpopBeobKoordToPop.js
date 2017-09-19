// @flow
import clone from 'lodash/clone'
import axios from 'axios'
import { toJS } from 'mobx'

export default async (store: Object, beobId: string): Promise<void> => {
  if (!beobId) {
    return store.listError(new Error('keine beobId übergeben'))
  }
  const beobzuordnung = store.table.beobzuordnung.get(beobId)
  if (!beobzuordnung) {
    return store.listError(
      new Error(`Die Beobachtung mit beobId ${beobId} wurde nicht gefunden`)
    )
  }
  const beob = store.table.beob.get(beobId)
  const { X, Y } = beob
  const tpopId = beobzuordnung.TPopId
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
  tpopInStore.TPopXKoord = X
  tpopInStore.TPopYKoord = Y
  tpopInStore.MutWer = store.user.name
  tpopInStore.MutWann = new Date().toISOString()
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
  // server expects TPopId to be called id
  tpopForDb.id = tpopForDb.TPopId
  delete tpopForDb.TPopId
  // server expects user to be added as user
  tpopForDb.user = store.user.name
  // server adds MutWer and MutWann itself
  delete tpopForDb.MutWer
  delete tpopForDb.MutWann
  // update db
  try {
    await axios.put('/tpop', tpopForDb)
  } catch (error) {
    tpopInStore = originalTpop
    store.listError(error)
  }
}
