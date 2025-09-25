import { getAndValidateCoordinatesOfBeob } from './getAndValidateCoordinatesOfBeob.js'

export const showCoordOfBeobOnMapGeoAdminCh = async ({
  id,
  enqueNotification,
  apolloClient,
}) => {
  const beob = await getAndValidateCoordinatesOfBeob({
    id,
    enqueNotification,
    apolloClient,
  })
  const lv95X = beob?.lv95X
  const lv95Y = beob?.lv95Y
  if (lv95X && lv95Y) {
    window.open(
      `https://map.geo.admin.ch/?bgLayer=ch.swisstopo.pixelkarte-farbe&Y=${lv95X}&X=${lv95Y}&zoom=10&crosshair=circle`,
      'target="_blank"',
    )
  }
}
