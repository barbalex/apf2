// @flow
import axios from 'axios'
import apiBaseUrl from '../../modules/apiBaseUrl'

export default (store: Object): void => {
  if (!store.map.detailplaene) {
    const url = `${apiBaseUrl}/geojson/detailplaeneWgs84.json`
    axios
      .get(url)
      .then(({ data }) => {
        store.map.detailplaene = data
      })
      .catch(error => store.listError(error))
  }
}
