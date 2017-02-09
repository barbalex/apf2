// @flow
import { runInAction, computed } from 'mobx'
import axios from 'axios'
import app from 'ampersand-app'
import cloneDeep from 'lodash/cloneDeep'

import apiBaseUrl from './apiBaseUrl'
import recordValuesForWhichTableDataWasFetched from './recordValuesForWhichTableDataWasFetched'

const writeToStore = (store, data) => {
  runInAction(() => {
    data.forEach((d) => {
      d.beobzuordnung = computed(() => store.table.beobzuordnung.get(d.BeobId))
      store.table.beob_bereitgestellt.set(d.BeobId, d)
    })
  })
}

export default (store:Object, apArtId:number) => {
  if (!apArtId) {
    return new Error(`action fetchBeobBereitgestellt: apArtId must be passed`)
  }

  // only fetch if not yet fetched
  const { valuesForWhichTableDataWasFetched } = store
  if (
    valuesForWhichTableDataWasFetched.beob_bereitgestellt &&
    valuesForWhichTableDataWasFetched.beob_bereitgestellt.NO_ISFS &&
    valuesForWhichTableDataWasFetched.beob_bereitgestellt.NO_ISFS.includes(apArtId)
  ) {
    return
  }

  const url = `${apiBaseUrl}/schema/beob/table/beob_bereitgestellt/field/NO_ISFS/value/${apArtId}`
  store.table.beob_bereitgestelltLoading = true
  app.db.beob_bereitgestellt
    .toArray()
    .then((data) => {
      writeToStore(store, data)
      store.table.beob_bereitgestelltLoading = false
      recordValuesForWhichTableDataWasFetched({ store, table: `beob_bereitgestellt`, field: `NO_ISFS`, value: apArtId })
    })
    .then(() => axios.get(url))
    .then(({ data }) => {
      // leave ui react before this happens
      // leave ui react before this happens
      // copy array without the individual objects being references
      // otherwise the computed values are passed to idb
      // and this creates errors, ad they can't be cloned
      setTimeout(() => writeToStore(store, cloneDeep(data)))
      setTimeout(() => app.db.beob_bereitgestellt.bulkPut(data))
    })
    .catch(error => new Error(`error fetching data for table beob_bereitgestellt:`, error))
}
