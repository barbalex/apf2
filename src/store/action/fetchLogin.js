// @flow
import axios from 'axios'
import app from 'ampersand-app'
import jwtDecode from 'jwt-decode'

import processLogin from '../../modules/processLogin'

export default (store: Object, name: string, password: string): any => {
  store.loading.push('user')
  axios
    .post('/rpc/login', { username: name, pass: password })
    .then(result => {
      if (result) {
        const { data, status } = result
        if (data && data[0] && data[0].token) {
          const token = data[0].token
          const tokenDecoded = jwtDecode(token)
          const { username, role } = tokenDecoded
          processLogin({ store, name: username, role, token })
          // refresh currentUser in idb
          app.db.currentUser.clear()
          app.db.currentUser.put({ name: username, token, role })
        } else if (status !== 200) {
          // somehow fetchLogin sometimes gets called 3 times consecutively
          // and the second time data is an empty array
          // but: status is 200
          store.listError(new Error('Anmeldung gescheitert'))
        }
      } else {
        // somehow then happens with result undefined if user is unauthorized
        return store.listError(new Error('Anmeldung gescheitert'))
      }
      store.loading = store.loading.filter(el => el !== 'user')
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== 'user')
      console.log('fetchLogin: error:', error)
      console.log('fetchLogin: error.response:', error.response)
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // make response the error
        return store.listError(error.response.data)
      }
      store.listError(error)
    })
}
