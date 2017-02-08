// @flow
import app from 'ampersand-app'

export default (store:Object) => {
  app.db.currentUser
  .toArray()
  .then((users) => {
    console.log(`setLoginFromIdb: users:`, users)
    if (users[0] && users[0].name) {
      store.user.name = users[0].name
    } else {
      store.user.name = ``
    }
  })
  .catch((error) => {
    console.log(error)
    store.user.name = ``
  })
}
