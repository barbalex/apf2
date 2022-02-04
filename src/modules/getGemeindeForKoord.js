/**
 * Diese Methode um Gemeinden zu ermitteln wird momentan nicht benutzt
 * Stattdessen wird tabelle ch_administrative_units ausgewertet
 * Diese Methode behalten - könnte künftig nützlich sein
 */
import axios from 'redaxios'

const getGemeindeForKoord = async ({ lv95X, lv95Y, store }) => {
  const { enqueNotification } = store
  const url = `https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryPoint&geometry=${lv95X},${lv95Y}&imageDisplay=1391,1070,96&mapExtent=548945.5,147956,549402,148103.5&tolerance=0&layers=all:ch.swisstopo-vd.geometa-gemeinde&returnGeometry=false&sr=2056`
  let result
  try {
    result = await axios.get(url)
  } catch (error) {
    return enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const data = result?.data
  const gemeindename = data
    ? JSON.parse(data)?.results?.[0]?.attributes?.gemeindename ?? null
    : null
  return gemeindename
}

export default getGemeindeForKoord
