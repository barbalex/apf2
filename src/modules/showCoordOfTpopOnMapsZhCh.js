import { getAndValidateCoordinatesOfTpop } from './getAndValidateCoordinatesOfTpop.js'

export const showCoordOfTpopOnMapsZhCh = async ({
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
      `https://maps.zh.ch/?x=${lv95X}&y=${lv95Y}&scale=3000&markers=ring`,
      'target="_blank"',
    )
  }
}
