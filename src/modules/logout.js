// @flow
import app from 'ampersand-app'

export default ({
  store,
  client
}:{
  store: Object,
  client: Object
}): void => {
  console.log('LOGGING OUT')
  app.db.currentUser.clear()
  client.resetStore()
  window.location.reload(false)
}
