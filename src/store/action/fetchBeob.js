// @flow
import { runInAction, computed } from 'mobx'
import axios from 'axios'
import cloneDeep from 'lodash/cloneDeep'

import recordValuesForWhichTableDataWasFetched from '../../modules/recordValuesForWhichTableDataWasFetched'
import apiBaseUrlBeob from '../../modules/apiBaseUrlBeob'

const writeToStore = (store, data) => {
  runInAction(() => {
    data.forEach(beob => {
      beob.beobzuordnung = computed(() =>
        store.table.beobzuordnung.get(beob.id)
      )
      store.table.beob.set(beob.id, beob)
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

  recordValuesForWhichTableDataWasFetched({
    store,
    table: 'beob',
    field: 'ArtId',
    value: apArtId,
  })
  axios
    .get({ url: `beob?ArtId=eq.${apArtId}`, baseURL: apiBaseUrlBeob })
    .then(({ data }) => {
      // copy array without the individual objects being references
      // otherwise the computed values are passed to idb
      // and this creates errors, as they can't be cloned
      writeToStore(store, cloneDeep(data))
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== 'beob')
      // remove setting that prevents loading of this value
      valuesForWhichTableDataWasFetched.beob.ArtId = valuesForWhichTableDataWasFetched.beob.ArtId.filter(
        x => x !== apArtId
      )
      store.listError(error)
    })
}
