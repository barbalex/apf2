// @flow
import axios from 'axios'

import staticFilesBaseUrl from './staticFilesBaseUrl'

export default ({
  setDetailplaene,
  errorState,
}:{
  setDetailplaene: () => void,
  errorState: Object,
}): void => {
  const baseURL = staticFilesBaseUrl
  const url = `/detailplaeneWgs84neu.json`
  axios
    .get(url, { baseURL })
    .then(({ data }) =>
      setDetailplaene(data)
    )
    .catch(error => errorState.add(error))
}
