import axios from 'axios'
import staticFilesBaseUrl from './staticFilesBaseUrl'

export default async ({ setDetailplaene, addError }) => {
  const baseURL = staticFilesBaseUrl
  const url = `/detailplaeneWgs84neu.json`
  //const axios = await import('axios').then(m => m.default)
  let result
  try {
    result = await axios.get(url, { baseURL })
  } catch (error) {
    addError(error)
  }
  setDetailplaene(result.data)
}
