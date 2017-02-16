// @flow
import axios from 'axios'
import app from 'ampersand-app'

import apiBaseUrl from './apiBaseUrl'
import writeToStore from './writeToStore'

export default async (store:Object, metadata:object, tableName:string) => {
  if (!metadata) {
    return store.listError(new Error(`action fetchStammdatenTable: metadata must be passed`))
  }
  const { database, table, idField } = metadata
  store.loading.push(table)
  let url = `${apiBaseUrl}/schema/${database}/table/${table}`
  if (table === `adb_lr`) {
    url = `${apiBaseUrl}/lrDelarze`
  }

  let dataFromDb
  try {
    const dataFromDbObject = await axios.get(url)
    dataFromDb = dataFromDbObject.data
  } catch(error) {
    store.listError(error)
  }
  if (dataFromDb && dataFromDb.length) {
    // leave ui react before this happens
    setTimeout(() => {
      writeToStore({ store, data: dataFromDb, table, field: idField })
    })
    setTimeout(() =>
      app.db[table].bulkPut(dataFromDb)
    )
  }
  store.loading = store.loading.filter(el => el !== table)
}
