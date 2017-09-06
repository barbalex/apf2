// @flow
import { runInAction, computed } from 'mobx'
import axios from 'axios'
import app from 'ampersand-app'
import cloneDeep from 'lodash/cloneDeep'

import recordValuesForWhichTableDataWasFetched from '../../modules/recordValuesForWhichTableDataWasFetched'

const writeToStore = (store, data) => {
  runInAction(() => {
    data.forEach(d => {
      d.beobzuordnung = computed(() => store.table.beobzuordnung.get(d.BeobId))
      store.table.beob.set(d.id, d)
    })
  })
}

export default (store: Object, apArtId: number): any => {
  // only fetch if not yet fetched
  const { valuesForWhichTableDataWasFetched } = store
  if (
    valuesForWhichTableDataWasFetched.beob &&
    valuesForWhichTableDataWasFetched.beob.ArtId &&
    valuesForWhichTableDataWasFetched.beob.ArtId.includes(apArtId)
  ) {
    return
  }

  const url = `/schema/beob/table/beob/field/ArtId/value/${apArtId}`
  store.loading.push('beob')
  app.db.beob
    .toArray()
    .then(data => {
      writeToStore(store, data)
      recordValuesForWhichTableDataWasFetched({
        store,
        table: 'beob',
        field: 'ArtId',
        value: apArtId,
      })
    })
    .then(() => axios.get(url))
    .then(({ data }) => {
      store.loading = store.loading.filter(el => el !== 'beob')
      // leave ui react before this happens
      // leave ui react before this happens
      // copy array without the individual objects being references
      // otherwise the computed values are passed to idb
      // and this creates errors, as they can't be cloned
      setTimeout(() => writeToStore(store, cloneDeep(data)))
      setTimeout(() => app.db.beob.bulkPut(data))
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== 'beob')
      store.listError(error)
    })
}
