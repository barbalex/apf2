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

  app.db.pop
    .toArray()
    .then((data) => {
      writeToStore({ store, data, table: `pop`, field: `PopId` })
      recordValuesForWhichTableDataWasFetched({ store, table: `popForAp`, field: `ApArtId`, value: apArtId })
      return axios.get(url)
    })
    .then(({ data }) => {
      // leave ui react before this happens
      setTimeout(() => writeToStore({ store, data, table: `pop`, field: `PopId` }))
      setTimeout(() => app.db.tpop.bulkPut(data))
    })
    .catch(error => new Error(`error fetching tpop for ap ${apArtId}:`, error))
}
