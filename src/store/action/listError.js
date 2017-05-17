// @flow

export default (store: Object, error: Object): void => {
  // reinitialize db if db has problem
  // happens after resfactoring db structure
  if (
    error.message.includes('IDBDatabase') &&
    error.message.includes('One of the specified object stores was not found')
  ) {
    window.indexedDB.deleteDatabase('apflora')
    window.open(window.location.href, '_self')
  }
  store.app.errors.unshift(error)
  setTimeout(() => {
    store.app.errors.pop()
  }, 1000 * 10)
  console.log('Error:', error) // eslint-disable-line no-console
}
