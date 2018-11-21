//@flow
/**
 * in this function
 * default values are set
 * but only those that are async
 */
import get from 'lodash/get'
import jwtDecode from 'jwt-decode'

export default async ({ idb }) => {
  const users = await idb.currentUser.toArray()
  const name = get(users, '[0].name', '')
  const token = get(users, '[0].token', null)

  const tokenDecoded = token ? jwtDecode(token) : null
  const userIsFreiw =
    tokenDecoded &&
    tokenDecoded.role &&
    tokenDecoded.role === 'apflora_freiwillig'
  const view = userIsFreiw ? 'ekf' : 'normal'

  const initialStore = {
    user: {
      name,
      token,
    },
    view,
  }

  return initialStore
}
