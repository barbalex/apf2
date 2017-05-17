// @flow
import Dexie from 'dexie'
import tables from './tables'

export default () => {
  const tablesObject = {}
  tables.forEach(t => {
    if (t.table && t.idField) {
      tablesObject[t.table] = `${t.idField}`
    }
  })
  // add fields
  tablesObject.fields = '[table_schema+table_name+column_name]'
  // create table to save user name in
  // this helps in that user can open new tab and remain logged in!
  tablesObject.currentUser = 'name'
  const db = new Dexie('apflora')
  db.version(1).stores(tablesObject)
  return db
}
