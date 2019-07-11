import get from 'lodash/get'
import jwtDecode from 'jwt-decode'

export default async ({ idb, store }) => {
  const users = await idb.currentUser.toArray()
  const name = get(users, '[0].name', '')
  const token = get(users, '[0].token', null)

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
