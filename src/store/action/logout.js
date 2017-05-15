// @flow
import app from 'ampersand-app'

export default (store: Object): void => {
  store.user.name = ''
  app.db.currentUser.clear()
}
