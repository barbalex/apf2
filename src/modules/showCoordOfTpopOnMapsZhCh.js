import { getAndValidateCoordinatesOfTpop } from './getAndValidateCoordinatesOfTpop.js'

export const showCoordOfTpopOnMapsZhCh = async ({
  id,
  enqueNotification,
  client,
}) => {
  const { lv95X, lv95Y } = await getAndValidateCoordinatesOfTpop({
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
