import axios from 'axios'
import app from 'ampersand-app'

import apiBaseUrl from './apiBaseUrl'
import tables from './tables'
import recordValuesForWhichTableDataWasFetched from './recordValuesForWhichTableDataWasFetched'
import writeToStore from './writeToStore'

export default (store, schemaNamePassed, tableName, parentId) => {
  if (!tableName) {
    return new Error(`action fetchTableByParentId: tableName must be passed`)
  }
  if (!parentId) {
    return new Error(`action fetchTableByParentId: parentId must be passed`)
  }
  const schemaName = schemaNamePassed || `apflora`
  const idField = tables.find(t => t.table === tableName).idField
  const parentIdField = tables.find(t => t.table === tableName).parentIdField

  // only fetch if not yet fetched
  const { valuesForWhichTableDataWasFetched } = store
  if (
    valuesForWhichTableDataWasFetched[tableName] &&
    valuesForWhichTableDataWasFetched[tableName][idField] &&
    valuesForWhichTableDataWasFetched[tableName][idField].includes(parentId)
  ) {
    return
  }

  const url = `${apiBaseUrl}/schema/${schemaName}/table/${tableName}/field/${parentIdField}/value/${parentId}`
  store.table[`${tableName}Loading`] = true

  app.db[tableName]
    .toArray()
    .then((data) => {
      writeToStore({ store, data, table: tableName, field: idField })
      store.table[`${tableName}Loading`] = false
      recordValuesForWhichTableDataWasFetched({ store, table: tableName, field: idField, value: parentId })
    })
    .then(() => axios.get(url))
    .then(({ data }) => {
      // leave ui react before this happens
      setTimeout(() => writeToStore({ store, data, table: tableName, field: idField }))
      setTimeout(() => app.db[tableName].bulkPut(data))
    })
    .catch(error => new Error(`error fetching data for table ${tableName}:`, error))
}
