// @flow
import axios from 'axios'

import recordValuesForWhichTableDataWasFetched from '../../modules/recordValuesForWhichTableDataWasFetched'

export default (store: Object, apId: number): any => {
  /*const { valuesForWhichTableDataWasFetched } = store

  // only fetch if not yet fetched
  if (
    valuesForWhichTableDataWasFetched.tpopForAp &&
    valuesForWhichTableDataWasFetched.tpopForAp.ap_id &&
    valuesForWhichTableDataWasFetched.tpopForAp.ap_id.includes(apId)
  ) {
    return
  }

  const url = `/v_tpop_for_ap?ap_id=eq.${apId}`
  store.loading.push('tpopForAp')
  axios
    .get(url)
    .then(({ data }) => {
      store.loading = store.loading.filter(el => el !== 'tpopForAp')
      store.writeToStore({ data, table: 'tpop', field: 'id' })
      recordValuesForWhichTableDataWasFetched({
        store,
        table: 'tpopForAp',
        field: 'ap_id',
        value: apId,
      })
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== 'tpopForAp')
      store.listError(error)
    })*/
}
