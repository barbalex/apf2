import axios from 'axios'
import get from 'lodash/get'

export default async ({ lv95X, lv95Y, addError }) => {
  const url = `https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryPoint&geometry=${lv95X},${lv95Y}&imageDisplay=1391,1070,96&mapExtent=548945.5,147956,549402,148103.5&tolerance=0&layers=all:ch.swisstopo-vd.geometa-gemeinde&returnGeometry=false&sr=2056`
  let result
  try {
    result = await axios.get(url)
  } catch (error) {
    addError(error)
    return null
  }
  return get(result, 'data.results[0].attributes.gemeindename', null)
}
