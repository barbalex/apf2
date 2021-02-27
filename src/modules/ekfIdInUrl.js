import isUuid from 'is-uuid'

const ekfIdInUrl = (url) => {
  if (url.includes('Freiwilligen-Kontrollen')) {
    const indexOfId = url.indexOf('Freiwilligen-Kontrollen') + 1
    if (url.length > indexOfId) {
      const id = url?.[indexOfId]
      if (isUuid.anyNonNil(id)) return id
    }
  }
  return undefined
}

export default ekfIdInUrl
