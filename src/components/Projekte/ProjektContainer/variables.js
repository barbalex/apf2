// @flow
import uniq from 'lodash/uniq'
import get from 'lodash/get'

import getActiveNodes from '../../../modules/getActiveNodes'

export default (data: Object, treeName: String): Object => {
  const activeNodeArray = get(data, `${treeName}.activeNodeArray`)
  const activeNodes = getActiveNodes(activeNodeArray)
  const openNodes = get(data, `${treeName}.openNodes`)
  const projekteTabs = get(data, 'urlQuery.projekteTabs', [])
  const mapIsActive = projekteTabs.includes('karte') || projekteTabs.includes('karte2')
  const isAdresse = openNodes.some(nodeArray => nodeArray[0] === 'Werte-Listen' && nodeArray[1] === 'Adressen')
  const isWerteListen = openNodes.some((nodeArray) => nodeArray[0] === 'Werte-Listen')
  const projekt = uniq(
    openNodes
      .map(a => (
        (
          a.length > 1 &&
          a[0] === 'Projekte'
        ) ?
          a[1] :
          null
      ))
      .filter(v => v !== null)
  )
  const projId = activeNodes.projekt || '99999999-9999-9999-9999-999999999999'
  const isProjekt = projekt.length > 0
  const ap = uniq(
    openNodes
      .map(a => (
        (
          a.length > 3 &&
          a[0] === 'Projekte' &&
          decodeURIComponent(a[2]) === 'Aktionspläne'
        ) ?
          a[3] :
          null
      ))
      .filter(v => v !== null)
  )
  const apId = activeNodes.ap || '99999999-9999-9999-9999-999999999999'
  const ziel = uniq(
    openNodes
      .map(a => (
        (
          a.length > 7 &&
          a[0] === 'Projekte' &&
          decodeURIComponent(a[2]) === 'Aktionspläne' &&
          a[4] === 'AP-Ziele'
        ) ?
          a[6] :
          null
      ))
      .filter(v => v !== null)
  )
  const pop = uniq(
    openNodes
      .map(a => (
        (
          a.length > 5 &&
          a[0] === 'Projekte' &&
          decodeURIComponent(a[2]) === 'Aktionspläne' &&
          a[4] === 'Populationen'
        ) ?
          a[5] :
          null
      ))
      .filter(v => v !== null)
  )
  const tpop = uniq(
    openNodes
      .map(a => (
        (
          a.length > 7 &&
          a[0] === 'Projekte' &&
          decodeURIComponent(a[2]) === 'Aktionspläne' &&
          a[4] === 'Populationen' &&
          a[6] === 'Teil-Populationen'
        ) ?
          a[7] :
          null
      ))
      .filter(v => v !== null)
  )
  const tpopkontr = uniq(
    openNodes
      .map(a => (
        (
          a.length > 9 &&
          a[0] === 'Projekte' &&
          decodeURIComponent(a[2]) === 'Aktionspläne' &&
          a[4] === 'Populationen' &&
          a[6] === 'Teil-Populationen' &&
          ['Feld-Kontrollen', 'Freiwilligen-Kontrollen'].includes(a[8])
        ) ?
          a[9] :
          null
      ))
      .filter(v => v !== null)
  )
  const variables = {
    projekt,
    projId,
    isProjekt,
    ap,
    apId,
    isAp: ap.length > 0,
    ziel,
    isZiel: ziel.length > 0,
    pop,
    isPop: pop.length > 0,
    tpop,
    isTpop: tpop.length > 0,
    tpopkontr,
    isTpopkontr: tpopkontr.length > 0,
    apIsActiveInMap: mapIsActive && ap.length > 0,
    isWerteListen,
    isAdresse,
  }

  return variables
}
