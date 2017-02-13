// @flow
import axios from 'axios'
import app from 'ampersand-app'

import apiBaseUrl from './apiBaseUrl'
import recordValuesForWhichTableDataWasFetched from './recordValuesForWhichTableDataWasFetched'
import writeToStore from './writeToStore'

export default (store:Object, apArtId:number) => {
  if (!apArtId) {
    return new Error(`action fetchTpopForAp: apArtId must be passed`)
  }
  const { valuesForWhichTableDataWasFetched } = store

  // only fetch if not yet fetched
  if (
    valuesForWhichTableDataWasFetched.tpopForAp &&
    valuesForWhichTableDataWasFetched.tpopForAp.ApArtId &&
    valuesForWhichTableDataWasFetched.tpopForAp.ApArtId.includes(apArtId)
  ) {
    return
  }

  const url = `${apiBaseUrl}/tpopForAp/${apArtId}`
  store.loading.push(`tpopForAp`)
  app.db.tpop
    .toArray()
    .then((data) => {
      writeToStore({ store, data, table: `tpop`, field: `TPopId` })
      recordValuesForWhichTableDataWasFetched({ store, table: `tpopForAp`, field: `ApArtId`, value: apArtId })
      return axios.get(url)
    })
    .then(({ data }) => {
      store.loading = store.loading.filter(el => el !== `tpopForAp`)
      // leave ui react before this happens
      setTimeout(() => writeToStore({ store, data, table: `tpop`, field: `TPopId` }))
      setTimeout(() => app.db.tpop.bulkPut(data))
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== `tpopForAp`)
      store.listError(error)
    })
}
