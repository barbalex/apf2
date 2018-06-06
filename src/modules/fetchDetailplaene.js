// @flow
import axios from 'axios'

import staticFilesBaseUrl from './staticFilesBaseUrl'
import listError from './listError'

export default (setDetailplaene: () => void): void => {
  const baseURL = staticFilesBaseUrl
  const url = `/detailplaeneWgs84neu.json`
  axios
    .get(url, { baseURL })
    .then(({ data }) =>
      setDetailplaene(data)
    )
    .catch(error => listError(error))
}
