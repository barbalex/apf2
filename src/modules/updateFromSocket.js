import tables from './tables'

export default (store, payload) => {
  const { table, type, row } = payload
  const tableMeta = tables.find(t => t.table === table)
  const idField = tableMeta.idField
  if (tableMeta && idField) {
    const id = row[idField]
    if (type === `UPDATE` || type === `INSERT`) {
      store.table[table].set(id, row)
    } else if (type === `DELETE`) {
      store.table[table].delete(id)
    }
  }
}
