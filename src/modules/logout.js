// @flow
import app from 'ampersand-app'

export default async (): void => {
  console.log('LOGGING OUT')
  app.db.currentUser.clear()
  window.location.reload(false)
}
