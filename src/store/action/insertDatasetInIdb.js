// @flow
import app from 'ampersand-app'

export default (store: Object, table: string, dataset: Object): Promise<any> =>
  app.db[table].put(dataset).catch(error => store.listError(error))
