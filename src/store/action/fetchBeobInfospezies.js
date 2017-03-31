// @flow
import { runInAction, computed } from 'mobx'
import axios from 'axios'
import app from 'ampersand-app'
import cloneDeep from 'lodash/cloneDeep'

import apiBaseUrl from '../../modules/apiBaseUrl'
import recordValuesForWhichTableDataWasFetched from '../../modules/recordValuesForWhichTableDataWasFetched'

const writeToStore = (store, data) => {
  runInAction(() => {
    data.forEach((d) => {
      d.beob_bereitgestellt = computed(() => store.table.beob_bereitgestellt.get(d.NO_NOTE))
      store.table.beob_infospezies.set(d.NO_NOTE, d)
    })
  })
}

export default (store:Object, apArtId:number) => {
  if (!apArtId) {
    return new Error(`action fetchBeobEvab: apArtId must be passed`)
  }

  // only fetch if not yet fetched
  const { valuesForWhichTableDataWasFetched } = store
  if (
    valuesForWhichTableDataWasFetched.beob_infospezies &&
    valuesForWhichTableDataWasFetched.beob_infospezies.NO_ISFS &&
    valuesForWhichTableDataWasFetched.beob_infospezies.NO_ISFS.includes(apArtId)
  ) {
    return
  }

  const url = `${apiBaseUrl}/schema/beob/table/beob_infospezies/field/NO_ISFS/value/${apArtId}`
  store.loading.push(`beob_infospezies`)
  app.db.beob_infospezies
    .toArray()
    .then((data) => {
      writeToStore(store, data)
      recordValuesForWhichTableDataWasFetched({ store, table: `beob_infospezies`, field: `NO_ISFS`, value: apArtId })
    })
    .then(() => axios.get(url))
    .then(({ data }) => {
      store.loading = store.loading.filter(el => el !== `beob_infospezies`)
      // leave ui react before this happens
      // leave ui react before this happens
      // copy array without the individual objects being references
      // otherwise the computed values are passed to idb
      // and this creates errors, as they can't be cloned
      setTimeout(() => writeToStore(store, cloneDeep(data)))
      setTimeout(() => app.db.beob_infospezies.bulkPut(data))
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== `beob_infospezies`)
      store.listError(error)
    })
}
