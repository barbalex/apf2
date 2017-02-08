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
  axios.get(url)
    .then(({ data }) => {
      if (data && data.length > 0) {
        if (data[0].NurLesen === -1) {
          store.app.readOnly = true
        }
        store.user.name = name
        app.db.currentUser.clear()
        app.db.currentUser.put({ name })
      } else {
        store.listError(new Error(`Anmeldung gescheitert`))
      }
    })
    .catch((error) =>
      store.listError(error)
    )
}
