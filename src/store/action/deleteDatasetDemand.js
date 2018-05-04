// @flow
import tables from '../../modules/tables'

export default (
  store: Object,
  table: String,
  id: String,
  url: String,
  label: String
): void => {
  const tableMetadata = tables.find(t => t.table === table)
  if (!tableMetadata) {
    return store.listError(
      new Error(`no table meta data found for table "${table}"`)
    )
  }
  const idField = tableMetadata.idField
  if (!idField) {
    return store.listError(
      new Error('dataset was not deleted as no idField could be found')
    )
  }
  store.datasetToDelete = { table, id, idField, url, label }
}
