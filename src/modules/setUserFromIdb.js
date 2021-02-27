import jwtDecode from 'jwt-decode'

import getUserFromIdb from './getUserFromIdb'

const setUserFromIdb = async ({ idb, store }) => {
  const user = await getUserFromIdb({ idb })
  const { name, token } = user

  const tokenDecoded = token ? jwtDecode(token) : null
  const userIsFreiw =
    tokenDecoded &&
    tokenDecoded.role &&
    tokenDecoded.role === 'apflora_freiwillig'
  const view = userIsFreiw ? 'ekf' : 'normal'

  const { setUser, setView } = store

  setUser({ name, token })
  setView(view)
  return name
}

export default setUserFromIdb
