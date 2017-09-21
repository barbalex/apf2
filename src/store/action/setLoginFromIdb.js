// @flow
import app from 'ampersand-app'
//import axios from 'axios'

// store.user.name default value is set to something random
// because if it is empty, the login form appears for
// just a very short time until currentUser was
// fetched from idb
// so need to set store.user.name to '' if something
// goes wrong or no user name is received
export default (store: Object): void =>
  app.db.currentUser
    .toArray()
    .then(users => {
      // TODO Authorization
      // fetch jwt key
      //axios.defaults.headers.common['Authorization'] = "jwt key"
      // read role
      if (users[0] && users[0].name) {
        store.user.name = users[0].name
        store.user.readOnly = users[0].readOnly
        store.messages.fetch()
      } else {
        store.user.name = ''
        store.user.readOnly = true
      }
    })
    .catch(error => {
      store.listError(error)
      store.user.name = ''
    })
