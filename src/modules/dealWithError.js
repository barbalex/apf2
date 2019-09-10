export default ({ store, error, component }) => {
  const { user, setUser } = store
  const { message } = error
  if (
    message.includes('keine Berechtigung') ||
    message.includes('permission denied')
  ) {
    console.log('dealWithError, will nullify token', { message, component })
    setUser({ name: user.name || null, token: null })
    return null
  } else {
    return `Fehler${component ? ` in ${component}` : ''}: ${message}`
  }
}
