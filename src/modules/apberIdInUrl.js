import isUuid from 'is-uuid'

export default (url) => {
  if (url[4] === 'AP-Berichte') {
    const indexOfId = url.indexOf('AP-Berichte') + 1
    if (url.length > indexOfId) {
      const id = url?.[indexOfId]
      if (isUuid.anyNonNil(id)) return id
    }
  }
  return undefined
}
