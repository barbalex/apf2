// @flow
import app from 'ampersand-app'

// store.user.name default value is set to something random
// because if it is empty, the login form appears for
// just a very short time until currentUser was
// fetched from idb
// so need to set store.user.name to `` if something
// goes wrong or no user name is received
export default (store:Object) => {
  app.db.currentUser
  .toArray()
  .then((users) => {
    if (users[0] && users[0].name) {
      store.user.name = users[0].name
    } else {
      store.user.name = ``
    }
  })
  .catch((error) => {
    store.listError(error)
    store.user.name = ``
  })
}
