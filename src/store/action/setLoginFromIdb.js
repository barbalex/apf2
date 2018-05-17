// @flow
import app from 'ampersand-app'

import processLogin from '../../modules/processLogin'

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
      if (users[0] && users[0].name && users[0].token) {
        const { name, token } = users[0]
        processLogin({ store, name, token })
      } else {
        store.logout()
      }
    })
    .catch(error => {
      store.listError(error)
      store.user.name = ''
    })
