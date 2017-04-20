// @flow
import clone from 'lodash/clone'
import axios from 'axios'
import { toJS } from 'mobx'

import apiBaseUrl from '../../modules/apiBaseUrl'
import insertDatasetInIdb from './insertDatasetInIdb'

export default (store: Object, beobId: string): void => {
  if (!beobId) {
    return store.listError(new Error(`keine beobId übergeben`))
  }
  const beobzuordnung = store.table.beobzuordnung.get(beobId)
  if (!beobzuordnung) {
    return store.listError(
      new Error(`Die Beobachtung mit beobId ${beobId} wurde nicht gefunden`)
    )
  }
  let beob
  let x
  let y
  if (beobzuordnung.QuelleId === 1) {
    beob = store.table.beob_evab.get(beobId)
    if (!beob) {
      return store.listError(
        new Error(
          `Die EvAB-Beobachtung mit beobId ${beobId} wurde nicht gefunden`
        )
      )
    }
    x = beob.COORDONNEE_FED_E
    y = beob.COORDONNEE_FED_N
  } else {
    beob = store.table.beob_infospezies.get(beobId)
    if (!beob) {
      return store.listError(
        new Error(
          `Die Infospezies-Beobachtung mit beobId ${beobId} wurde nicht gefunden`
        )
      )
    }
    x = beob.FNS_XGIS
    y = beob.FNS_YGIS
  }
  const tpopId = beobzuordnung.TPopId
  let tpopInStore = store.table.tpop.get(tpopId)
  if (!tpopInStore) {
    return store.listError(
      new Error(`Die Teilpopulation mit tpopId ${tpopId} wurde nicht gefunden`)
    )
  }
  if (!x || !y) {
    return store.listError(
      new Error(
        `Es wurden keine Koordinaten gefunden. Daher wurden sie nicht in die Teilpopulation kopiert`
      )
    )
  }
  // keep original pop in case update fails
  const originalTpop = clone(tpopInStore)
  tpopInStore.TPopXKoord = x
  tpopInStore.TPopYKoord = y
  tpopInStore.MutWer = store.user.name
  tpopInStore.MutWann = new Date().toISOString()
  const tpopForDb = clone(toJS(tpopInStore))
  // remove empty values
  Object.keys(tpopForDb).forEach(k => {
    if ((!tpopForDb[k] && tpopForDb[k] !== 0) || tpopForDb[k] === `undefined`) {
      delete tpopForDb[k]
    }
  })
  // remove computed fields that do not exist in db
  delete tpopForDb.label
  delete tpopForDb.popNr
  delete tpopForDb.herkunft
  delete tpopForDb.distance
  const tpopForIdb = clone(tpopForDb)
  // server expects TPopId to be called id
  tpopForDb.id = tpopForDb.TPopId
  delete tpopForDb.TPopId
  // server expects user to be added as user
  tpopForDb.user = store.user.name
  // server adds MutWer and MutWann itself
  delete tpopForDb.MutWer
  delete tpopForDb.MutWann
  // update db
  const url = `${apiBaseUrl}/updateMultiple/apflora/tabelle=tpop/felder=${JSON.stringify(tpopForDb)}`
  axios
    .put(url)
    .then(() => {
      // put this dataset in idb
      insertDatasetInIdb(store, `tpop`, tpopForIdb)
    })
    .catch(error => {
      tpopInStore = originalTpop
      store.listError(error)
    })
}
