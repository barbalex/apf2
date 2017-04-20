// @flow
import axios from 'axios'
import app from 'ampersand-app'

import apiBaseUrl from '../../modules/apiBaseUrl'
import recordValuesForWhichTableDataWasFetched
  from '../../modules/recordValuesForWhichTableDataWasFetched'

export default (store: Object, apArtId: number): any => {
  if (!apArtId) {
    return store.listError(
      new Error(`action fetchPopForAp: apArtId must be passed`)
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

  store.loading.push(`popForAp`)
  app.db.pop
    .toArray()
    .then(data => {
      store.writeToStore({ data, table: `pop`, field: `PopId` })
      recordValuesForWhichTableDataWasFetched({
        store,
        table: `popForAp`,
        field: `ApArtId`,
        value: apArtId
      })
      return axios.get(`${apiBaseUrl}/popForAp/${apArtId}`)
    })
    .then(({ data }) => {
      store.loading = store.loading.filter(el => el !== `popForAp`)
      // leave ui react before this happens
      setTimeout(() =>
        store.writeToStore({ data, table: `pop`, field: `PopId` })
      )
      setTimeout(() => app.db.pop.bulkPut(data))
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== `popForAp`)
      store.listError(error)
    })
}
