// @flow
import axios from 'axios'
import { toJS } from 'mobx'

import staticFilesBaseUrl from '../../modules/staticFilesBaseUrl'

export default (store: Object): void => {
  const markierungen = toJS(store.map.markierungen)

  if (!markierungen) {
    const baseURL = staticFilesBaseUrl
    const url = `/markierungen.json`
    axios
      .get(url, { baseURL })
      .then(({ data }) => store.map.setMarkierungen(data))
      .catch(error => store.listError(error))
  }
}
