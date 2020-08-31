import isUuid from 'is-uuid'

export default (url) => {
  if (url.length > 3 && decodeURIComponent(url[2]) === 'Aktionspläne') {
    const id = url[3]
    if (isUuid.anyNonNil(id)) return id
  }
  return undefined
}
