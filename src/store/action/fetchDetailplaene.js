// @flow
import axios from 'axios'
import appBaseUrl from '../../modules/appBaseUrl'

export default (store: Object): void => {
  if (!store.map.detailplaene) {
    const baseURL = appBaseUrl
    const url = `/static-files/detailplaeneWgs84.json`
    axios
      .get(url, { baseURL })
      .then(({ data }) => {
        store.map.detailplaene = data
      })
      .catch(error => store.listError(error))
  }
}
