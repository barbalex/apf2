// @flow
//import axios from 'axios'

//import tables from '../../modules/tables'

export default async (store: Object, tableName: string) => {
  // only fetch if not yet fetched
  /*if (!store.loading.includes(tableName) && store.table[tableName].size === 0) {
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
    const url = `/${tableName}`

    let dataFromDb
    try {
      const dataFromDbObject = await axios.get(url)
      dataFromDb = dataFromDbObject.data
    } catch (error) {
      store.listError(error)
    }
    if (dataFromDb && dataFromDb.length) {
      store.writeToStore({
        data: dataFromDb,
        table: tableName,
        field: idField,
      })
    }
    store.loading = store.loading.filter(el => el !== tableName)
  }*/
}
