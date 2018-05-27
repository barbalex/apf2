// @flow
import clone from 'lodash/clone'
import axios from 'axios'
import { toJS } from 'mobx'

import listError from '../../modules/listError'

export default async (store: Object, tpopId: number): Promise<void> => {
  if (!tpopId) {
    return listError(new Error('keine tpopId übergeben'))
  }
  const tpop = store.table.tpop.get(tpopId)
  if (!tpop) {
    return listError(
      new Error(
        `Für die Teilpopulation mit tpopId ${tpopId} wurde keine Teilpopulation gefunden`
      )
    )
  }
  if (!tpop.x || !tpop.y) {
    return listError(
      new Error(
        `Die Teilpopulation mit tpopId ${tpopId} hat keine (vollständigen) Koordinaten. Daher wurden sie nicht in die Population kopiert`
      )
    )
  }
  if (!tpop.pop_id) {
    return listError(
      new Error(`Die Teilpopulation mit tpopId ${tpopId} hat keine Population`)
    )
  }
  let popInStore = store.table.pop.get(tpop.pop_id)
  if (!popInStore) {
    return listError(
      new Error(
        `Für die Teilpopulation mit tpopId ${tpopId} wurde keine Population gefunden`
      )
    )
  }
  // keep original pop in case update fails
  const originalPop = clone(popInStore)
  popInStore.x = tpop.x
  popInStore.y = tpop.y
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
    await axios.patch(`/pop?id=eq.${popForDb.id}`, popForDb)
  } catch (error) {
    popInStore = originalPop
    return listError(error)
  }
}
