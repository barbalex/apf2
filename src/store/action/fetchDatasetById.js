// @flow
import axios from 'axios'
import app from 'ampersand-app'

import tables from '../../modules/tables'
import recordValuesForWhichTableDataWasFetched from '../../modules/recordValuesForWhichTableDataWasFetched'

export default ({
  store,
  schemaName,
  tableName,
  id,
}: {
  store: Object,
  schemaName: string,
  tableName: string,
  id: number | string,
}): any => {
  if (!tableName) {
    return store.listError(
      new Error('action fetchDatasetById: tableName must be passed')
    )
  }
  if (!id) {
    return store.listError(
      new Error('action fetchDatasetById: id must be passed')
    )
  }
  schemaName = schemaName || 'apflora' // eslint-disable-line no-param-reassign

  // $FlowIssue
  const idField = tables.find(t => t.table === tableName).idField

  // only fetch if not yet fetched
  const { valuesForWhichTableDataWasFetched } = store
  if (
    valuesForWhichTableDataWasFetched[tableName] &&
    valuesForWhichTableDataWasFetched[tableName][idField] &&
    valuesForWhichTableDataWasFetched[tableName][idField].includes(id)
  ) {
    return
  }

  const url = `/schema/${schemaName}/table/${tableName}/field/${idField}/value/${id}`

  store.loading.push(tableName)
  app.db[tableName]
    .toArray()
    .then(data => {
      // dont write all data - filter for needed id first
      const dataToWrite = data.filter(d => d[idField] === id)
      store.writeToStore({
        data: dataToWrite,
        table: tableName,
        field: idField,
      })
      recordValuesForWhichTableDataWasFetched({
        store,
        table: tableName,
        field: idField,
        value: id,
      })
    })
    .then(() => axios.get(url))
    .then(({ data }) => {
      store.loading = store.loading.filter(el => el !== tableName)
      // leave ui react before this happens
      setTimeout(() =>
        store.writeToStore({ data, table: tableName, field: idField })
      )
      setTimeout(() => app.db[tableName].bulkPut(data))
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== tableName)
      store.listError(error)
    })
}
