import localForage from 'localforage'

export default async idb => {
  console.log('LOGGING OUT')
  if (typeof window !== 'undefined') {
    localForage.clear()
    idb.delete()
    window.location.reload(true)
  }
}
