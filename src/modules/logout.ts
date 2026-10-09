import localForage from 'localforage'

import { store, clearAllStorageAtom } from '../store/index.ts'

export const logout = async () => {
  console.log('LOGGING OUT')
  void localForage.clear()

  store.set(clearAllStorageAtom)
  // TODO: clear all other caches in the browser tab
  window.location.reload()
}
