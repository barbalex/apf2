import Dexie from 'dexie'

const initializeIdb = () => {
  const tablesObject = {}
  // create table to save user login in
  // this helps in that user can open new tab and remain logged in!
  tablesObject.currentUser = 'name'
  const idb = new Dexie('apflora')
  idb.version(1).stores(tablesObject)
  return idb
}

export default initializeIdb
