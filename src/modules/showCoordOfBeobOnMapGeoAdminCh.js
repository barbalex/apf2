import { getAndValidateCoordinatesOfBeob } from './getAndValidateCoordinatesOfBeob.js'

export const showCoordOfBeobOnMapGeoAdminCh = async ({
  id,
  enqueNotification,
  client,
}) => {
  const { lv95X, lv95Y } = await getAndValidateCoordinatesOfBeob({
    id,
    enqueNotification,
    client,
  })
  if (lv95X && lv95Y) {
    window.open(
      `https://map.geo.admin.ch/?bgLayer=ch.swisstopo.pixelkarte-farbe&Y=${lv95X}&X=${lv95Y}&zoom=10&crosshair=circle`,
      'target="_blank"',
    )
  }
}
