// @flow
import app from 'ampersand-app'

export default async (): void => {
  console.log('LOGGING OUT')
  app.db.currentUser.clear()
  //app.client.resetStore()
  window.location.reload(false)
}
