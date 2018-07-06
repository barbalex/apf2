// @flow
import axios from 'axios'
import staticFilesBaseUrl from './staticFilesBaseUrl'

export default async ({
  setDetailplaene,
  errorState,
}:{
  setDetailplaene: () => void,
  errorState: Object,
}): void => {
  const baseURL = staticFilesBaseUrl
  const url = `/detailplaeneWgs84neu.json`
  //const axios = await import('axios')
  let result
  try {
    result = await axios.get(url, { baseURL })
  } catch (error) {
    errorState.add(error)
  }
  setDetailplaene(result.data)
}
