import { getAndValidateCoordinatesOfBeob } from './getAndValidateCoordinatesOfBeob.ts'

import {
  store,
  addNotificationAtom,
} from '../store/index.ts'
export const showCoordOfBeobOnMapGeoAdminCh = async ({ id }) => {
  const beob = await getAndValidateCoordinatesOfBeob({ id })
  const lv95X = beob?.lv95X
  const lv95Y = beob?.lv95Y
  if (lv95X && lv95Y) {
    window.open(
      `https://map.geo.admin.ch/?bgLayer=ch.swisstopo.pixelkarte-farbe&Y=${lv95X}&X=${lv95Y}&zoom=10&crosshair=circle`,
      'target="_blank"',
    )
  }
}
