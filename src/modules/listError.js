export default (store, error) => {
  store.app.errors.unshift(error)
  setTimeout(() => {
    store.app.errors.pop()
  }, 1000 * 10)
  console.log(`Error:`, error)  // eslint-disable-line no-console
}
