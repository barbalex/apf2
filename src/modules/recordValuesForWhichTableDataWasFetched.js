// @flow
export default ({
  store,
  table,
  field,
  value,
}: {
  store: Object,
  table: String,
  field: String,
  value: String | Number,
}): void => {
  const { valuesForWhichTableDataWasFetched } = store
  // record that data was fetched for this value
  if (!valuesForWhichTableDataWasFetched[table]) {
    valuesForWhichTableDataWasFetched[table] = {}
  }
  if (!valuesForWhichTableDataWasFetched[table][field]) {
    valuesForWhichTableDataWasFetched[table][field] = []
  }
  if (!valuesForWhichTableDataWasFetched[table][field].includes(value)) {
    valuesForWhichTableDataWasFetched[table][field].push(value)
  }
}
