// @flow
import axios from 'axios'
import staticFilesBaseUrl from './staticFilesBaseUrl'

export default async ({
  setKtZh,
  errorState,
}: {
  setKtZh: () => void,
  errorState: Object,
}): void => {
  const baseURL = staticFilesBaseUrl
  const url = `/ktZh.json`
  //const axios = await import('axios').then(m => m.default)
  let result
  try {
    result = await axios.get(url, { baseURL })
  } catch (error) {
    errorState.add(error)
  }
  setKtZh(result.data)
}
