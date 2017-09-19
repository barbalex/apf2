// @flow
import axios from 'axios'
import recordValuesForWhichTableDataWasFetched from '../../modules/recordValuesForWhichTableDataWasFetched'

export default (store: Object, apArtId: number): any => {
  if (!apArtId) {
    return store.listError(
      new Error('action fetchPopForAp: apArtId must be passed')
    )
  }
  const { valuesForWhichTableDataWasFetched } = store

  // only fetch if not yet fetched
  if (
    valuesForWhichTableDataWasFetched.popForAp &&
    valuesForWhichTableDataWasFetched.popForAp.ApArtId &&
    valuesForWhichTableDataWasFetched.popForAp.ApArtId.includes(apArtId)
  ) {
    return
  }

  store.loading.push('popForAp')
  axios
    .get(`/pop?ApArtId=eq.${apArtId}`)
    .then(({ data }) => {
      store.loading = store.loading.filter(el => el !== 'popForAp')
      store.writeToStore({ data, table: 'pop', field: 'PopId' })
      recordValuesForWhichTableDataWasFetched({
        store,
        table: 'popForAp',
        field: 'ApArtId',
        value: apArtId,
      })
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== 'popForAp')
      store.listError(error)
    })
}
