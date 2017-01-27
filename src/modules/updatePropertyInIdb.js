import app from 'ampersand-app'

export default (store, table, datasetId, key, value) => {
  app.db[table].get(datasetId)
    .then((dataset) => {
      dataset[key] = value
      return app.db[table].put(dataset)
    })
    .catch(error =>
      store.listError(error)
    )
}
