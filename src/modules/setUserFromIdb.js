import { getUserFromIdb } from './getUserFromIdb.js'

export const setUserFromIdb = async ({ idb, store }) => {
  const user = await getUserFromIdb({ idb })
  const { name, token, id } = user
  const { setUser } = store

  setUser({ name, token, id })

  return name
}
