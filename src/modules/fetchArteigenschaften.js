// @flow
import axios from 'axios'
import app from 'ampersand-app'

import apiBaseUrl from './apiBaseUrl'
import writeToStore from './writeToStore'

export default async (store:Object) => {
  store.loading.push(`adb_eigenschaften`)
  let url = `${apiBaseUrl}/schema/beob/table/adb_eigenschaften`

  let data
  try {
    const dataFromDbObject = await axios.get(url)
    data = dataFromDbObject.data
  } catch(error) {
    store.listError(error)
  }
  if (data && data.length) {
    // leave ui react before this happens
    setTimeout(() => {
      // app.writeToStoreWorker.postMessage(`testmessage`)
      writeToStore({ store, data, table: `adb_eigenschaften`, field: `TaxonomieId` })
    })
    setTimeout(() =>
      app.db.adb_eigenschaften.bulkPut(data)
    )
  }
  store.loading = store.loading.filter(el => el !== `adb_eigenschaften`)
}
