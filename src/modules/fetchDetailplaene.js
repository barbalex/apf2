// @flow
import axios from 'axios'
import staticFilesBaseUrl from './staticFilesBaseUrl'

export default async ({
  setDetailplaene,
  errorState,
}: {
  setDetailplaene: () => void,
  errorState: Object,
}): void => {
  const baseURL = staticFilesBaseUrl
  const url = `/detailplaeneWgs84neu.json`
  //const axios = await import('axios').then(m => m.default)
  let result
  try {
    result = await axios.get(url, { baseURL })
  } catch (error) {
    console.log('fetchDateilplane, error:', error)
    errorState.add(error)
  }
  console.log('fetchDetailplaene, will set detailplaene:', result.data)
  setDetailplaene(result.data)
}
