// @flow
import axios from 'axios'

import tables from '../../modules/tables'
import recordValuesForWhichTableDataWasFetched from '../../modules/recordValuesForWhichTableDataWasFetched'

export default async ({
  store,
  tableName,
  id,
}: {
  store: Object,
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

  const table = tables.find(t => t.table === tableName)
  if (!table) {
    return store.listError(new Error(`not table found with name: ${tableName}`))
  }
  const idField = table.idField
  if (!idField) {
    return store.listError(new Error(`not idField found in table ${tableName}`))
  }

  // only fetch if not yet fetched
  const { valuesForWhichTableDataWasFetched } = store
  if (
    valuesForWhichTableDataWasFetched[tableName] &&
    valuesForWhichTableDataWasFetched[tableName][idField] &&
    valuesForWhichTableDataWasFetched[tableName][idField].includes(id)
  ) {
    return
  }

  // set this before query runs
  // to prevent multiple same queries from running in parallel
  recordValuesForWhichTableDataWasFetched({
    store,
    table: tableName,
    field: idField,
    value: id,
  })
  const url = `/${tableName}?${idField}=eq.${id}`

  let result
  try {
    result = await axios.get(url)
  } catch (error) {
    // remove setting that prevents loading of this value
    valuesForWhichTableDataWasFetched[tableName][
      idField
    ] = valuesForWhichTableDataWasFetched[tableName][idField].filter(
      x => x !== id
    )
    store.listError(error)
  }
  // $FlowIssue
  const { data } = result
  store.writeToStore({ data, table: tableName, field: idField })
}
