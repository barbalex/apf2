// @flow
import staticFilesBaseUrl from './staticFilesBaseUrl'

export default async ({
  setMarkierungen,
  errorState,
}:{
  setMarkierungen: () => void,
  errorState: Object,
}): void => {
  const baseURL = staticFilesBaseUrl
  const url = `/markierungen.json`
  const axios = await import('axios')
  let result
  try {
    result = await axios.get(url, { baseURL })
  } catch (error) {
    errorState.add(error)
  }
  setMarkierungen(result.data)
}
