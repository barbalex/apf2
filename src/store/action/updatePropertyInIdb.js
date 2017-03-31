// @flow
import app from 'ampersand-app'

export default (store:Object, table:string, datasetId:string|number, key:string, value:string|number|null) => {
  app.db[table].get(datasetId)
    .then((ds) => {
      ds[key] = value
      return app.db[table].put(ds)
    })
    .catch(error =>
      store.listError(error)
    )
}
