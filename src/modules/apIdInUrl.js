import isUuid from 'is-uuid'

const apIdInUrl = (url) => {
  if (url.length > 3 && decodeURIComponent(url[2]) === 'Arten') {
    const id = url[3]
    if (isUuid.anyNonNil(id)) return id
  }
  return undefined
}

export default apIdInUrl
