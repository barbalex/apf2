// @flow
import { runInAction, computed } from 'mobx'
import axios from 'axios'
import app from 'ampersand-app'
import cloneDeep from 'lodash/cloneDeep'

import apiBaseUrl from '../../modules/apiBaseUrl'
import recordValuesForWhichTableDataWasFetched
  from '../../modules/recordValuesForWhichTableDataWasFetched'

const writeToStore = (store: Object, data: Array<Object>): void => {
  runInAction(() => {
    data.forEach(d => {
      d.beob_bereitgestellt = computed(() =>
        store.table.beob_bereitgestellt.get(d.NO_NOTE_PROJET)
      )
      store.table.beob_evab.set(d.NO_NOTE_PROJET, d)
    })
  })
}

export default (store: Object, apArtId: number): any => {
  if (!apArtId) {
    return store.listError(
      new Error(`action fetchBeobEvab: apArtId must be passed`)
    )
  }

  // only fetch if not yet fetched
  const { valuesForWhichTableDataWasFetched } = store
  if (
    valuesForWhichTableDataWasFetched.beob_evab &&
    valuesForWhichTableDataWasFetched.beob_evab.NO_ISFS &&
    valuesForWhichTableDataWasFetched.beob_evab.NO_ISFS.includes(apArtId)
  ) {
    return
  }

  const url = `${apiBaseUrl}/schema/beob/table/beob_evab/field/NO_ISFS/value/${apArtId}`
  store.loading.push(`beob_evab`)
  app.db.beob_evab
    .toArray()
    .then(data => {
      writeToStore(store, data)
      recordValuesForWhichTableDataWasFetched({
        store,
        table: `beob_evab`,
        field: `NO_ISFS`,
        value: apArtId
      })
    })
    .then(() => axios.get(url))
    .then(({ data }) => {
      store.loading = store.loading.filter(el => el !== `beob_evab`)
      // leave ui react before this happens
      // leave ui react before this happens
      // copy array without the individual objects being references
      // otherwise the computed values are passed to idb
      // and this creates errors, as they can't be cloned
      setTimeout(() => writeToStore(store, cloneDeep(data)))
      setTimeout(() => app.db.beob_evab.bulkPut(data))
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== `beob_evab`)
      store.listError(error)
    })
}
