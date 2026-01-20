import localForage from 'localforage'

import {store as jotaiStore, removeUserAtom} from '../JotaiStore/index.ts'

export const logout = async () => {
  console.log('LOGGING OUT')
  localForage.clear()
   
  jotaiStore.set(removeUserAtom)
  window.location.reload(true)
}
