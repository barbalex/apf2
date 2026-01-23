import localForage from 'localforage'

import {
  store,
  clearAllStorageAtom,
} from '../store/index.ts'

export const logout = async () => {
  console.log('LOGGING OUT')
  localForage.clear()

  store.set(clearAllStorageAtom)
  window.location.reload(true)
}
