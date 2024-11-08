import { getAndValidateCoordinatesOfBeob } from './getAndValidateCoordinatesOfBeob.js'

// client is apollo client
export const showCoordOfBeobOnMapsZhCh = async ({
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
      `https://maps.zh.ch/?x=${lv95X}&y=${lv95Y}&scale=3000&markers=ring`,
      'target="_blank"',
    )
  }
}
