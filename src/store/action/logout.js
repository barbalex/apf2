// @flow
import app from 'ampersand-app'

export default (store: Object) => {
  store.user.name = ``
  app.db.currentUser.clear()
}
