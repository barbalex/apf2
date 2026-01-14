import { getAndValidateCoordinatesOfTpop } from './getAndValidateCoordinatesOfTpop.ts'

export const showCoordOfTpopOnMapGeoAdminCh = async ({
  id,
  enqueNotification,
  apolloClient,
}) => {
  const { lv95X, lv95Y } = await getAndValidateCoordinatesOfTpop({
    id,
    enqueNotification,
    apolloClient,
  })
  if (lv95X && lv95Y) {
    window.open(
      `https://map.geo.admin.ch/?bgLayer=ch.swisstopo.pixelkarte-farbe&Y=${lv95X}&X=${lv95Y}&zoom=10&crosshair=circle`,
      'target="_blank"',
    )
  }
}
