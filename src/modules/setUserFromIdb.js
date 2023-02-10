import getUserFromIdb from './getUserFromIdb'

const setUserFromIdb = async ({ idb, store }) => {
  const user = await getUserFromIdb({ idb })
  const { name, token } = user
  const { setUser } = store

  setUser({ name, token })

  return name
}

export default setUserFromIdb
