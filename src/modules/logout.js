import localForage from 'localforage'

const logout = async (idb) => {
  console.log('LOGGING OUT')
  localForage.clear()
  // eslint-disable-next-line no-unused-expressions
  idb?.delete?.()
  window.location.reload(true)
}

export default logout
