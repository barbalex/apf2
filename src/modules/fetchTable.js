import axios from 'axios'
import app from 'ampersand-app'

import apiBaseUrl from './apiBaseUrl'
import tables from './tables'
import writeToStore from './writeToStore'

export default (store, schemaNamePassed, tableName) => {
  if (!tableName) {
    return store.listError(new Error(`action fetchTable: tableName must be passed`))
  }
  const schemaName = schemaNamePassed || `apflora`
  // only fetch if not yet fetched
  if (store.table[tableName].size === 0) {
    const idField = tables.find(t => t.table === tableName).idField
    store.table[`${tableName}Loading`] = true
    let url = `${apiBaseUrl}/schema/${schemaName}/table/${tableName}`
    if (tableName === `adb_lr`) {
      url = `${apiBaseUrl}/lrDelarze`
    }

    app.db[tableName]
      .toArray()
      .then((data) => {
        writeToStore({ store, data, table: tableName, field: idField })
        store.table[`${tableName}Loading`] = false
      })
      .then(() => axios.get(url))
      .then(({ data }) => {
        // leave ui react before this happens
        setTimeout(() => {
          // app.writeToStoreWorker.postMessage(`testmessage`)
          writeToStore({ store, data, table: tableName, field: idField })
        })
        setTimeout(() => app.db[tableName].bulkPut(data))
      })
      .catch(error => new Error(`error fetching data for table ${tableName}:`, error))
  }
}
