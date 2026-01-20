import { getUserFromIdb } from './getUserFromIdb.ts'
import { store as jotaiStore, userAtom } from '../JotaiStore/index.ts'

export const setUserFromIdb = async ({ idb }) => {
  const user = await getUserFromIdb({ idb })
  const { name, token, id } = user

  jotaiStore.set(userAtom, { name, token, id })

  return name
}

