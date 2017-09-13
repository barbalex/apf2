// @flow
import axios from 'axios'

export default (store: Object): void => {
  if (store.app.ktZh) return
  axios
    .get('/geojson/ktZh.json')
    .then(({ data }) => {
      store.app.ktZh = data
    })
    .catch(error => store.listError(error))
}
