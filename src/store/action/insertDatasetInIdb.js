// @flow
import app from 'ampersand-app'

export default (store: Object, table: string, dataset: Object) => {
  app.db[table].put(dataset)
    .catch(error =>
      store.listError(error)
    )
}
