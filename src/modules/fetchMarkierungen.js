// @flow
import axios from 'axios'

import staticFilesBaseUrl from './staticFilesBaseUrl'

export default ({
  setMarkierungen,
  errorState,
}:{
  setMarkierungen: () => void,
  errorState: Object,
}): void => {
  const baseURL = staticFilesBaseUrl
  const url = `/markierungen.json`
  axios
    .get(url, { baseURL })
    .then(({ data }) =>
      setMarkierungen(data)
    )
    .catch(error => errorState.add(error))
}
