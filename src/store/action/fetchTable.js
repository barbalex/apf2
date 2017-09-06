// @flow
import axios from 'axios'
import app from 'ampersand-app'

import tables from '../../modules/tables'

export default async (
  store: Object,
  schemaNamePassed: string,
  tableName: string
) => {
  const schemaName = schemaNamePassed || 'apflora'
  // only fetch if not yet fetched
  if (store.table[tableName].size === 0) {
    const tableMetadata = tables.find(t => t.table === tableName)
    if (!tableMetadata) {
      return store.listError(
        new Error(`keine Metadaten gefunden für Tabelle ${tableName}`)
      )
    }
    const idField = tableMetadata.idField
    if (!idField) {
      return store.listError(
        new Error(
          `in den Metadaten kein ID-Feld gefunden für Tabelle ${tableName}`
        )
      )
    }
    store.loading.push(tableName)
    let url = `/schema/${schemaName}/table/${tableName}`
    if (tableName === 'adb_lr') {
      url = '/lrDelarze'
    }

    let dataFromIdb
    try {
      dataFromIdb = await app.db[tableName].toArray()
    } catch (error) {
      store.listError(error)
    }
    if (dataFromIdb) {
      store.writeToStore({
        data: dataFromIdb,
        table: tableName,
        field: idField,
      })
      store.loading = store.loading.filter(el => el !== tableName)
    }

    // don't fetch any stammdaten if they already existed in idb
    if (
      tableMetadata.stammdaten &&
      dataFromIdb &&
      dataFromIdb.length &&
      dataFromIdb.length > 0
    ) {
      store.loading = store.loading.filter(el => el !== tableName)
      return
    }

    let dataFromDb
    try {
      const dataFromDbObject = await axios.get(url)
      dataFromDb = dataFromDbObject.data
    } catch (error) {
      store.listError(error)
    }
    if (dataFromDb && dataFromDb.length) {
      // leave ui react before this happens
      setTimeout(() =>
        store.writeToStore({
          data: dataFromDb,
          table: tableName,
          field: idField,
        })
      )
      setTimeout(() => app.db[tableName].bulkPut(dataFromDb))
    }
    store.loading = store.loading.filter(el => el !== tableName)
  }
}
