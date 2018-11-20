// @flow
export default async (idb: Object): void => {
  console.log('LOGGING OUT')
  idb.currentUser.clear()
  window.location.reload(false)
}
