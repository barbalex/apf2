import localForage from 'localforage'

import {
  store as jotaiStore,
  clearAllStorageAtom,
} from '../store/index.ts'

export const logout = async () => {
  console.log('LOGGING OUT')
  localForage.clear()

  jotaiStore.set(clearAllStorageAtom)
  window.location.reload(true)
}
