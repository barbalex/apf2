// @flow
//import axios from 'axios'
//import recordValuesForWhichTableDataWasFetched from '../../modules/recordValuesForWhichTableDataWasFetched'

export default (store: Object, apId: number): any => {
  /*if (!apId) {
    return store.listError(
      new Error('action fetchPopForAp: apId must be passed')
    )
  }
  const { valuesForWhichTableDataWasFetched } = store

  // only fetch if not yet fetched
  if (
    valuesForWhichTableDataWasFetched.popForAp &&
    valuesForWhichTableDataWasFetched.popForAp.ap_id &&
    valuesForWhichTableDataWasFetched.popForAp.ap_id.includes(apId)
  ) {
    return
  }

  store.loading.push('popForAp')
  axios
    .get(`/pop?ap_id=eq.${apId}`)
    .then(({ data }) => {
      store.loading = store.loading.filter(el => el !== 'popForAp')
      store.writeToStore({ data, table: 'pop', field: 'id' })
      recordValuesForWhichTableDataWasFetched({
        store,
        table: 'popForAp',
        field: 'ap_id',
        value: apId,
      })
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== 'popForAp')
      store.listError(error)
    })*/
}
