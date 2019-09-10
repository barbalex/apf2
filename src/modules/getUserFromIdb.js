export default async ({ idb }) => {
  const users = await idb.currentUser.toArray()
  const user = users[0] || { name: '', token: null }
  // set null if token is empty
  if (!(user && user.token)) user.token = null
  return user
}
