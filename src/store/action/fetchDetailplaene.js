// @flow
import axios from 'axios'

export default (store: Object): void => {
  if (!store.map.detailplaene) {
    const url = `/geojson/detailplaeneWgs84.json`
    axios
      .get(url)
      .then(({ data }) => {
        store.map.detailplaene = data
      })
      .catch(error => store.listError(error))
  }
}
