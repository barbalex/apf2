// @flow
import axios from 'axios'

import tables from '../../modules/tables'
import recordValuesForWhichTableDataWasFetched from '../../modules/recordValuesForWhichTableDataWasFetched'

export default (
  store: Object,
  schemaNamePassed: string,
  tableName: string,
  parentId: number
): void => {
  const schemaName = schemaNamePassed || 'apflora'

  const table = tables.find(t => t.table === tableName)
  if (!table) {
    return store.listError(new Error(`not table found with name: ${tableName}`))
  }
  const idField = table.idField
  if (!idField) {
    return store.listError(new Error(`not idField found in table ${tableName}`))
  }
  // $FlowIssue
  const parentIdField = table.parentIdField
  if (!parentIdField) {
    return store.listError(
      new Error(`not parentIdField found in table ${tableName}`)
    )
  }

  // only fetch if not yet fetched
  const { valuesForWhichTableDataWasFetched } = store
  if (
    valuesForWhichTableDataWasFetched[tableName] &&
    valuesForWhichTableDataWasFetched[tableName][parentIdField] &&
    valuesForWhichTableDataWasFetched[tableName][parentIdField].includes(
      parentId
    )
  ) {
    return
  }
  // set this before query runs
  // to prevent multiple same queries from running in parallel
  recordValuesForWhichTableDataWasFetched({
    store,
    table: tableName,
    field: parentIdField,
    value: parentId,
  })
  const url = `/schema/${schemaName}/table/${tableName}/field/${parentIdField}/value/${parentId}`

  axios
    .get(url)
    .then(({ data }) => {
      // leave ui react before this happens
      setTimeout(() => {
        store.writeToStore({ data, table: tableName, field: idField })
      })
    })
    .catch(error => {
      // remove setting that prevents loading of this value
      valuesForWhichTableDataWasFetched[tableName][
        parentIdField
      ] = valuesForWhichTableDataWasFetched[tableName][parentIdField].filter(
        x => x !== parentId
      )
      store.listError(error)
    })
}
