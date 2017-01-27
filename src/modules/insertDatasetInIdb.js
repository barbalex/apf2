import app from 'ampersand-app'

export default (store, table, dataset) => {
  app.db[table].put(dataset)
    .catch(error =>
      store.listError(error)
    )
}
