// @flow
import axios from 'axios'
import get from 'lodash/get'

export default async ({
  x,
  y,
  errorState,
}: {
  x: number,
  y: number,
  errorState: Object,
}) => {
  const url = `https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryPoint&geometry=${x},${y}&imageDisplay=1391,1070,96&mapExtent=548945.5,147956,549402,148103.5&tolerance=0&layers=all:ch.swisstopo-vd.geometa-gemeinde&returnGeometry=false&sr=2056`
  let result
  try {
    result = await axios.get(url)
  } catch (error) {
    errorState.add(error)
    return null
  }
  console.log('getGemeindeForKoord, result:', result)
  return get(result, 'data.results[0].attributes.gemeindename', null)
}
