// @flow
import Dexie from 'dexie'

export default () => {
  const tablesObject = {}
  // create table to save user login in
  // this helps in that user can open new tab and remain logged in!
  tablesObject.currentUser = 'name'
  const db = new Dexie('apflora')
  db.version(1).stores(tablesObject)
  return db
}
