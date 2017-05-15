// @flow
import { runInAction } from 'mobx'
import app from 'ampersand-app'

import fetchFields from './fetchFields'

export default (store: Object): void => {
  // only fetch if not yet done
  if (store.app.fields.length === 0 && !store.loading.includes('fields')) {
    app.db.fields
      .toArray()
      .then(values => {
        if (values.length > 0) {
          runInAction(() => {
            store.app.fields = values
          })
        } else {
          fetchFields(store)
        }
      })
      .catch(error => store.listError(error))
  }
}
