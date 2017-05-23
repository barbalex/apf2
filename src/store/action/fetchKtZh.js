// @flow
import axios from 'axios'
import apiBaseUrl from '../../modules/apiBaseUrl'

export default (store: Object): void => {
  if (!store.app.ktZh) {
    const url = `${apiBaseUrl}/geojson/ktZh.json`
    axios
      .get(url)
      .then(({ data }) => {
        store.app.ktZh = data
      })
      .catch(error => store.listError(error))
  }
}
