import localForage from 'localforage'

export const logout = async (idb) => {
  console.log('LOGGING OUT')
  localForage.clear()
   
  idb?.delete?.()
  window.location.reload(true)
}
