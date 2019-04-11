import axios from 'axios'
import staticFilesBaseUrl from './staticFilesBaseUrl'

export default async ({ setKtZh, addError }) => {
  const baseURL = staticFilesBaseUrl
  const url = `/ktZh.json`
  //const axios = await import('axios').then(m => m.default)
  let result
  try {
    result = await axios.get(url, { baseURL })
  } catch (error) {
    addError(error)
  }
  setKtZh(result.data)
}
