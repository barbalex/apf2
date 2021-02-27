import isUuid from 'is-uuid'

const apberuebersichtIdInUrl = (url) => {
  if (url[2] === 'AP-Berichte') {
    const indexOfId = url.indexOf('AP-Berichte') + 1
    if (url.length > indexOfId) {
      const id = url?.[indexOfId]
      if (isUuid.anyNonNil(id)) return id
    }
  }
  return undefined
}

export default apberuebersichtIdInUrl
