// @flow
import axios from 'axios'

import staticFilesBaseUrl from './staticFilesBaseUrl'

export default ({
  setKtZh,
  errorState,
}:{
  setKtZh: () => void,
  errorState: Object,
}): void => {
  const baseURL = staticFilesBaseUrl
  const url = `/ktZh.json`
  axios
    .get(url, { baseURL })
    .then(({ data }) =>
      setKtZh(data)
    )
    .catch(error => errorState.add(error))
}
