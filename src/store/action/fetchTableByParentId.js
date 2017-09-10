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
  // $FlowIssue
  const idField = tables.find(t => t.table === tableName).idField
  // $FlowIssue
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

  const url = `/schema/${schemaName}/table/${tableName}/field/${parentIdField}/value/${parentId}`
  store.loading.push(tableName)

  axios
    .get(url)
    .then(({ data }) => {
      store.loading = store.loading.filter(el => el !== tableName)
      // leave ui react before this happens
      setTimeout(() => {
        store.writeToStore({ data, table: tableName, field: idField })
        recordValuesForWhichTableDataWasFetched({
          store,
          table: tableName,
          field: idField,
          value: parentId,
        })
      })
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== tableName)
      store.listError(error)
    })
}
