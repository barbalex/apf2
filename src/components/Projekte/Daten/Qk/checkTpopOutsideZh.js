//@flow
import axios from 'axios'
import isFinite from 'lodash/isFinite'
import get from 'lodash/get'
import flatten from 'lodash/flatten'

import isPointInsidePolygon from './isPointInsidePolygon'
import staticFilesBaseUrl from '../../../../modules/staticFilesBaseUrl'

export default async ({ store, data, addMessages, setOutsideZhChecked, checkingOutsideZh }) => {
  if (checkingOutsideZh) return
  console.log('checkTpopOutsideZh:', {data})
  const pops = get(data, 'projektById.apsByProjId.nodes[0].popsByApId.nodes', [])
  console.log('checkTpopOutsideZh:', {pops})
  const tpops =  flatten(pops.map(p => get(p, 'tpopsByPopId.nodes', [])))
  const projName = get(data, 'projektById.name', '(kein Name)')
  const artName = get(data, 'projektById.apsByProjId.nodes[0].aeEigenschaftenByArtId.artname', '(keine Art)')
  console.log('checkTpopOutsideZh:', {tpops,projName,artName})

  let resultKtZh: { data: Object }
  try {
    const baseURL = staticFilesBaseUrl
    resultKtZh = await axios.get('/ktZh.json', { baseURL })
  } catch (error) {
    store.listError(error)
    return setOutsideZhChecked(true)
  }
  const ktZh = resultKtZh.data
  console.log('checkTpopOutsideZh:', { resultKtZh })
  if (ktZh) {
    console.log('checkTpopOutsideZh:', { ktZh })
    // kontrolliere die Relevanz ausserkantonaler Tpop
    const tpopsOutsideZh = tpops.filter(
      tpop =>
        tpop.apberRelevant === 1 &&
        tpop.x &&
        isFinite(tpop.x) &&
        tpop.y &&
        isFinite(tpop.y) &&
        !isPointInsidePolygon(ktZh, tpop.x, tpop.y)
    )
    console.log('checkTpopOutsideZh:', { tpopsOutsideZh })
    if (tpopsOutsideZh.length > 0) {
      const messages = tpopsOutsideZh.map(tpop => ({
        hw: `Teilpopulation ist als 'Für AP-Bericht relevant' markiert, liegt aber ausserhalb des Kt. Zürich und sollte daher nicht relevant sein:`,
        url: [
          'Projekte',
          1,
          'Aktionspläne',
          tpop.ap_id,
          'Populationen',
          tpop.pop_id,
          'Teil-Populationen',
          tpop.id,
        ],
        text: [
          `Projekt: ${projName}`,
          `Art: ${artName}`,
          `Population: ${get(tpop, 'popByPopId.nr', '(keine Nr')}, ${get(tpop, 'popByPopId.name', '(kein Name')}`,
          `Teil-Population: ${get(tpop, 'nr', '(keine Nr')}, ${get(tpop, 'flurname', '(kein Flurname')}`,
        ],
      }))
      console.log('checkTpopOutsideZh:', { messages, tpopsOutsideZh})
      addMessages(messages)
      return setOutsideZhChecked(true) 
    }
  }
  console.log('checkTpopOutsideZh: no ktZH')
  setOutsideZhChecked(true)
}