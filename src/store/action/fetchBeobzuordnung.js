// @flow
import { runInAction, computed } from 'mobx'
import axios from 'axios'
import cloneDeep from 'lodash/cloneDeep'

import recordValuesForWhichTableDataWasFetched from '../../modules/recordValuesForWhichTableDataWasFetched'

const writeToStore = (store: Object, data: Array<Object>): void => {
  runInAction(() => {
    data.forEach(zuordnung => {
      // set computed value "beob"
      zuordnung.beob = computed(() => store.table.beob.get(zuordnung.beob_id))
      // set computed value "type"
      zuordnung.type = computed(() => {
        if (zuordnung.nicht_zuordnen && zuordnung.nicht_zuordnen === 1) {
          return 'nichtZuzuordnen'
        }
        if (zuordnung.tpop_id) {
          return 'zugeordnet'
        }
        return 'nichtBeurteilt'
      })
      store.table.tpopbeob.set(zuordnung.beob_id, zuordnung)
    })
  })
}

export default (store: Object, apId: number): any => {
  // console.log('module fetchBeobzuordnung: apId:', apId)
  const { valuesForWhichTableDataWasFetched } = store
  if (!apId) {
    return store.listError(
      new Error('action fetchBeobzuordnung: apId must be passed')
    )
  }

  // only fetch if not yet fetched
  if (
    valuesForWhichTableDataWasFetched.tpopbeob &&
    valuesForWhichTableDataWasFetched.tpopbeob.art_id &&
    valuesForWhichTableDataWasFetched.tpopbeob.art_id.includes(apId)
  ) {
    return
  }

  store.loading.push('tpopbeob')
  axios
    .get(`/v_tpopbeob?ap_id=eq.${apId}`)
    .then(({ data }) => {
      store.loading = store.loading.filter(el => el !== 'tpopbeob')
      // copy array without the individual objects being references
      // otherwise the computed values are passed to idb
      // and this creates errors, ad they can't be cloned
      writeToStore(store, cloneDeep(data))
      recordValuesForWhichTableDataWasFetched({
        store,
        table: 'tpopbeob',
        field: 'art_id',
        value: apId,
      })
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== 'tpopbeob')
      store.listError(error)
    })
}
