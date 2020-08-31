import isUuid from 'is-uuid'

export default (url) => {
  if (url.length > 5 && url[4] === 'Populationen') {
    const id = url[5]
    if (isUuid.anyNonNil(id)) return id
  }
  return undefined
}
