// @flow
import clone from 'lodash/clone'
import axios from 'axios'
import { toJS } from 'mobx'

import apiBaseUrl from '../../modules/apiBaseUrl'
import insertDatasetInIdb from './insertDatasetInIdb'

export default (store:Object, tpopId:number) => {
  if (!tpopId) {
    return store.listError(new Error(`keine tpopId übergeben`))
  }
  const tpop = store.table.tpop.get(tpopId)
  if (!tpop) {
    return store.listError(
      new Error(`Für die Teilpopulation mit tpopId ${tpopId} wurde keine Teilpopulation gefunden`)
    )
  }
  if (!tpop.TPopXKoord || !tpop.TPopYKoord) {
    return store.listError(
      new Error(`Die Teilpopulation mit tpopId ${tpopId} hat keine (vollständigen) Koordinaten. Daher wurden sie nicht in die Population kopiert`)
    )
  }
  if (!tpop.PopId) {
    return store.listError(new Error(`Die Teilpopulation mit tpopId ${tpopId} hat keine Population`))
  }
  let popInStore = store.table.pop.get(tpop.PopId)
  if (!popInStore) {
    return store.listError(
      new Error(`Für die Teilpopulation mit tpopId ${tpopId} wurde keine Population gefunden`)
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
  Object.keys(popForDb).forEach((k) => {
    if (
      (!popForDb[k] && popForDb[k] !== 0) ||
      popForDb[k] === `undefined`
    ) {
      delete popForDb[k]
    }
  })
  // remove label and PopKoordWgs84: fields do not exist in db, are computed
  delete popForDb.label
  delete popForDb.PopKoordWgs84
  const popForIdb = clone(popForDb)
  // server expects TPopId to be called id
  popForDb.id = popForDb.PopId
  delete popForDb.PopId
  // server expects user to be added as user
  popForDb.user = store.user.name
  // server adds MutWer and MutWann itself
  delete popForDb.MutWer
  delete popForDb.MutWann
  // update db
  const url = `${apiBaseUrl}/updateMultiple/apflora/tabelle=pop/felder=${JSON.stringify(popForDb)}`
  axios.put(url)
    .then(() => {
      // put this dataset in idb
      insertDatasetInIdb(store, `pop`, popForIdb)
    })
    .catch((error) => {
      popInStore = originalPop
      store.listError(error)
    })
}
