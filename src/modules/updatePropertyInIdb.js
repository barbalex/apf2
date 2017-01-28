// @flow
import app from 'ampersand-app'

export default (store:Object, table:string, datasetId:string|number, key:string, value:string|number|null) => {
  app.db[table].get(datasetId)
    .then((dataset) => {
      dataset[key] = value
      return app.db[table].put(dataset)
    })
    .catch(error =>
      store.listError(error)
    )
}
