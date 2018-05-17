// @flow
import app from 'ampersand-app'

export default (store: Object, client: Object, refetch: Object): void => {
  console.log('LOGGING OUT')
  app.db.currentUser.clear()
  client.resetStore()
  if (refetch) refetch()
}
