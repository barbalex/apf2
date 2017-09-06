// @flow
import axios from 'axios'

export default (store: Object): void => {
  if (!store.app.ktZh) {
    const url = '/geojson/ktZh.json'
    axios
      .get(url)
      .then(({ data }) => {
        store.app.ktZh = data
      })
      .catch(error => store.listError(error))
  }
}
