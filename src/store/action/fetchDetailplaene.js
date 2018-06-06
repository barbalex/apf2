// @flow
import axios from 'axios'
import { toJS } from 'mobx'

import staticFilesBaseUrl from '../../modules/staticFilesBaseUrl'
import listError from '../../modules/listError'

export default (store: Object): void => {
  const detailplaene = toJS(store.detailplaene)

  if (!detailplaene) {
    const baseURL = staticFilesBaseUrl
    const url = `/detailplaeneWgs84neu.json`
    axios
      .get(url, { baseURL })
      .then(({ data }) => {
        store.detailplaene = data
      })
      .catch(error => listError(error))
  }
}
