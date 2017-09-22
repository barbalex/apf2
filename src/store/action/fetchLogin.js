// @flow
import axios from 'axios'
import app from 'ampersand-app'
import jwtDecode from 'jwt-decode'

export default (store: Object, name: string, password: string): any => {
  store.loading.push('user')
  // TODO Authorization:
  // post to rpc/login
  axios
    //.get(`/user?UserName=eq.${name}&Passwort=eq.${password}`)
    .post('/rpc/login', { name, pass: password })
    .then(({ data, status, statusText }) => {
      console.log('fetchLogin: status from posting to /rpc/login:', status)
      if (data && data[0] && data[0].token) {
        const token = data[0].token
        const tokenDecoded = jwtDecode(token)
        const { name, role } = tokenDecoded
        store.user.name = name
        store.user.token = token
        store.user.role = role
        app.db.currentUser.clear()
        app.db.currentUser.put({ name, token, role })
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
