// @flow
import axios from 'axios'
import staticFilesBaseUrl from '../../modules/staticFilesBaseUrl'

export default (store: Object): void => {
  if (!store.map.detailplaene) {
    const baseURL = staticFilesBaseUrl
    const url = `/detailplaeneWgs84neu.json`
    axios
      .get(url, { baseURL })
      .then(result => {
        const { data } = result
        store.map.detailplaene = data
      })
      .catch(error => store.listError(error))
  }
}
