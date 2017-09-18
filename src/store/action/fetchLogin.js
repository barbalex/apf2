// @flow
import axios from 'axios'
import app from 'ampersand-app'

export default (store: Object, name: string, password: string): any => {
  const url = `/anmeldung/name=${name}/pwd=${password}`
  store.loading.push('user')
  axios
    .get(url)
    .then(({ data, status, statusText }) => {
      if (data && data.length > 0) {
        const readOnly = data[0].NurLesen === -1
        store.user.readOnly = readOnly
        store.user.name = name
        app.db.currentUser.clear()
        app.db.currentUser.put({ name, readOnly })
        store.messages.fetch()
      } else if (status !== 200) {
        // somehow fetchLogin sometimes gets called 3 times consecutively
        // and the second time data is an empty array
        // but: status is 200
        store.listError(new Error('Anmeldung gescheitert'))
      }
      store.loading = store.loading.filter(el => el !== 'user')
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== 'user')
      store.listError(error)
    })
}
