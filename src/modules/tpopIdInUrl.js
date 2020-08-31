import isUuid from 'is-uuid'

export default (url) => {
  if (url.includes('Teil-Populationen')) {
    const indexOfId = url.indexOf('Teil-Populationen') + 1
    if (url.length > indexOfId) {
      const id = url?.[indexOfId]
      if (isUuid.anyNonNil(id)) return id
    }
  }
  return undefined
}
