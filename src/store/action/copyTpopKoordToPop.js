// @flow
import clone from 'lodash/clone'
import axios from 'axios'
import { toJS } from 'mobx'

export default async (store: Object, tpopId: number): Promise<void> => {
  if (!tpopId) {
    return store.listError(new Error('keine tpopId übergeben'))
  }
  const tpop = store.table.tpop.get(tpopId)
  if (!tpop) {
    return store.listError(
      new Error(
        `Für die Teilpopulation mit tpopId ${tpopId} wurde keine Teilpopulation gefunden`
      )
    )
  }
  if (!tpop.TPopXKoord || !tpop.TPopYKoord) {
    return store.listError(
      new Error(
        `Die Teilpopulation mit tpopId ${tpopId} hat keine (vollständigen) Koordinaten. Daher wurden sie nicht in die Population kopiert`
      )
    )
  }
  if (!tpop.PopId) {
    return store.listError(
      new Error(`Die Teilpopulation mit tpopId ${tpopId} hat keine Population`)
    )
  }
  let popInStore = store.table.pop.get(tpop.PopId)
  if (!popInStore) {
    return store.listError(
      new Error(
        `Für die Teilpopulation mit tpopId ${tpopId} wurde keine Population gefunden`
      )
    )
  }
  // keep original pop in case update fails
  const originalPop = clone(popInStore)
  popInStore.PopXKoord = tpop.TPopXKoord
  popInStore.PopYKoord = tpop.TPopYKoord
  popInStore.MutWer = store.user.name
  popInStore.MutWann = new Date().toISOString()
  const popForDb = clone(toJS(popInStore))
  // remove empty values
  Object.keys(popForDb).forEach(k => {
    if ((!popForDb[k] && popForDb[k] !== 0) || popForDb[k] === 'undefined') {
      delete popForDb[k]
    }
  })
  // remove label and PopKoordWgs84: fields do not exist in db, are computed
  delete popForDb.label
  delete popForDb.PopKoordWgs84
  // update db
  try {
    await axios.patch(`/pop?PopId=eq.${popForDb.PopId}`, popForDb)
  } catch (error) {
    popInStore = originalPop
    store.listError(error)
  }
}
