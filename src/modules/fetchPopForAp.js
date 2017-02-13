// @flow
import axios from 'axios'
import app from 'ampersand-app'

import apiBaseUrl from './apiBaseUrl'
import recordValuesForWhichTableDataWasFetched from './recordValuesForWhichTableDataWasFetched'
import writeToStore from './writeToStore'

export default (store:Object, apArtId:number) => {
  if (!apArtId) {
    return new Error(`action fetchPopForAp: apArtId must be passed`)
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

  const url = `${apiBaseUrl}/popForAp/${apArtId}`
  store.loading.push(`popForAp`)
  app.db.pop
    .toArray()
    .then((data) => {
      writeToStore({ store, data, table: `pop`, field: `PopId` })
      recordValuesForWhichTableDataWasFetched({ store, table: `popForAp`, field: `ApArtId`, value: apArtId })
      return axios.get(url)
    })
    .then(({ data }) => {
      store.loading = store.loading.filter(el => el !== `popForAp`)
      // leave ui react before this happens
      setTimeout(() => writeToStore({ store, data, table: `pop`, field: `PopId` }))
      setTimeout(() => app.db.tpop.bulkPut(data))
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== `popForAp`)
      store.listError(error)
    })
}
