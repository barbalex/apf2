import axios from 'axios'

import staticFilesBaseUrl from './staticFilesBaseUrl'

export default async ({ setMarkierungen, addError }) => {
  const baseURL = staticFilesBaseUrl
  const url = `/markierungen.json`
  //const axios = await import('axios').then(m => m.default)
  let result
  try {
    result = await axios.get(url, { baseURL })
  } catch (error) {
    addError(error)
  }
  setMarkierungen(result.data)
}
