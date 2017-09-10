// @flow
import axios from 'axios'
import { runInAction } from 'mobx'

export default (store: Object): void => {
  // only fetch if not yet done
  if (store.app.fields.length === 0 && !store.loading.includes('fields')) {
    store.loading.push('fields')
    axios
      .get('/felder')
      .then(({ data }) => {
        runInAction(() => {
          store.app.fields = data
          store.loading = store.loading.filter(el => el !== 'fields')
        })
      })
      .catch(error => store.listError(error))
  }
}
