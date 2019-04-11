export default ({ store, error, component }) => {
  const { user, setUser } = store
  if (error.message.includes('keine Berechtigung')) {
    setUser({ name: user.name || null, token: null })
    return null
  } else {
    return `Fehler${component ? ` in ${component}` : ''}: ${error.message}`
  }
}
