// @flow
import app from 'ampersand-app'

export default (store: Object): void => {
  store.user.name = ''
  store.user.role = null
  store.user.jwt = null
  app.db.currentUser.clear()
}
