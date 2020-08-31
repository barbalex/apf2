import isUuid from 'is-uuid'

export default (url) => {
  if (url.includes('Projekte')) {
    const indexOfId = url.indexOf('Projekte') + 1
    if (url.length > indexOfId) {
      const id = url?.[indexOfId]
      if (isUuid.anyNonNil(id)) return id
    }
  }
  return undefined
}
