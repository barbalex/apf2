// @flow
export default ({ mobxStore, error }) => {
  const { user, setUser } = mobxStore
  if (error.message.includes('keine Berechtigung')) {
    setUser({ name: user.name || null, token: null })
  }
}
