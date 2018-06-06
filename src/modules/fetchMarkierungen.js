// @flow
import axios from 'axios'

import staticFilesBaseUrl from './staticFilesBaseUrl'
import listError from './listError'

export default (setMarkierungen: () => void): void => {
  const baseURL = staticFilesBaseUrl
  const url = `/markierungen.json`
  axios
    .get(url, { baseURL })
    .then(({ data }) =>
      setMarkierungen(data)
    )
    .catch(error => listError(error))
}
