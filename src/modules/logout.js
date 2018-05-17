// @flow
import app from 'ampersand-app'

export default (store: Object, client: Object): void => {
  console.log('LOGGING OUT')
  store.user.name = ''
  store.user.token = null
  app.db.currentUser.clear()
  client.resetStore()
}
