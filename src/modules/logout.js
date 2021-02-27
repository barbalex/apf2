import localForage from 'localforage'

const logout = async (idb) => {
  console.log('LOGGING OUT')
  if (typeof window !== 'undefined') {
    localForage.clear()
    // eslint-disable-next-line no-unused-expressions
    idb?.delete?.()
    window.location.reload(true)
  }
}

export default logout
