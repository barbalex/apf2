export default async idb => {
  console.log('LOGGING OUT')
  idb.currentUser.clear()
  window.location.reload(false)
}
