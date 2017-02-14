// @flow
import axios from 'axios'
import app from 'ampersand-app'

import apiBaseUrl from './apiBaseUrl'

export default (store:Object, name:string, password:string) => {
  if (!name) {
    return new Error(`action fetchLogin: name must be passed`)
  }
  if (!password) {
    return new Error(`action fetchLogin: password must be passed`)
  }

  const url = `${apiBaseUrl}/anmeldung/name=${name}/pwd=${password}`
  store.loading.push(`user`)
  axios.get(url)
    .then(({ data }) => {
      if (data && data.length > 0) {
        const readOnly = data[0].NurLesen === -1
        store.user.readOnly = readOnly
        store.user.name = name
        app.db.currentUser.clear()
        app.db.currentUser.put({ name, readOnly })
      } else {
        store.listError(new Error(`Anmeldung gescheitert`))
      }
      store.loading = store.loading.filter(el => el !== `user`)
    })
    .catch((error) => {
      store.loading = store.loading.filter(el => el !== `user`)
      store.listError(error)
    })
}
