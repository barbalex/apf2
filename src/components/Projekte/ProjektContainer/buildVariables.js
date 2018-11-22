// @flow
import uniq from 'lodash/uniq'
import get from 'lodash/get'

import getActiveNodes from '../../../modules/getActiveNodes'
import { type as apType } from '../../../mobxStore/NodeFilterTree/ap'
import { type as popType } from '../../../mobxStore/NodeFilterTree/pop'
import { type as tpopType } from '../../../mobxStore/NodeFilterTree/tpop'

export default ({
  dataLocal,
  treeName,
  nodeFilter,
  mobxStore,
}: {
  dataLocal: Object,
  treeName: String,
  nodeFilter: Object,
  mobxStore: Object,
}): Object => {
  const { urlQuery } = mobxStore
  const activeNodeArray = get(dataLocal, `${treeName}.activeNodeArray`)
  const apFilterSet = get(dataLocal, `${treeName}.apFilter`)
  const activeNodes = getActiveNodes(activeNodeArray)
  const openNodes = get(dataLocal, `${treeName}.openNodes`)

  const isWerteListen = openNodes.some(
    nodeArray => nodeArray[0] === 'Werte-Listen',
  )
  const isAdresse = openNodes.some(
    nodeArray => nodeArray[0] === 'Werte-Listen' && nodeArray[1] === 'Adressen',
  )
  const { projekteTabs } = urlQuery
  const mapIsActive =
    projekteTabs.includes('karte') || projekteTabs.includes('karte2')
  const projekt = uniq(
    openNodes
      .map(a => (a.length > 1 && a[0] === 'Projekte' ? a[1] : null))
      .filter(v => v !== null),
  )
  const projId = activeNodes.projekt || '99999999-9999-9999-9999-999999999999'
  const isProjekt = openNodes.some(
    nArray => nArray[0] === 'Projekte' && nArray[1],
  )
  const apFilter = { projId: { in: projId } }
  const apFilterValues = Object.entries(nodeFilter.ap).filter(
    e => e[1] || e[1] === 0,
  )
  apFilterValues.forEach(([key, value]) => {
    const expression = apType[key] === 'string' ? 'includes' : 'equalTo'
    apFilter[key] = { [expression]: value }
  })
  // for unknown reason the following only works belated, so not
  if (apFilterSet) {
    apFilter.bearbeitung = { in: [1, 2, 3] }
  }
  const ap = uniq(
    openNodes
      .map(a =>
        a.length > 3 &&
        a[0] === 'Projekte' &&
        decodeURIComponent(a[2]) === 'Aktionspläne'
          ? a[3]
          : null,
      )
      .filter(v => v !== null),
  )
  const apId = activeNodes.ap || '99999999-9999-9999-9999-999999999999'
  const isAp =
    isProjekt &&
    openNodes.some(nArray => nArray[2] === 'Aktionspläne' && nArray[3])
  const ziel = uniq(
    openNodes
      .map(a =>
        a.length > 7 &&
        a[0] === 'Projekte' &&
        decodeURIComponent(a[2]) === 'Aktionspläne' &&
        a[4] === 'AP-Ziele'
          ? a[6]
          : null,
      )
      .filter(v => v !== null),
  )
  const isZiel =
    isAp &&
    openNodes.some(nArray => nArray[4] === 'AP-Ziele' && nArray[5] && nArray[6])
  const pop = uniq(
    openNodes
      .map(a =>
        a.length > 5 &&
        a[0] === 'Projekte' &&
        decodeURIComponent(a[2]) === 'Aktionspläne' &&
        a[4] === 'Populationen'
          ? a[5]
          : null,
      )
      .filter(v => v !== null),
  )
  const isPop =
    isAp && openNodes.some(nArray => nArray[4] === 'Populationen' && nArray[5])
  const popFilter = { apId: { in: ap } }
  const popFilterValues = Object.entries(nodeFilter.pop).filter(
    e => e[1] || e[1] === 0,
  )
  popFilterValues.forEach(([key, value]) => {
    const expression = popType[key] === 'string' ? 'includes' : 'equalTo'
    popFilter[key] = { [expression]: value }
  })
  const tpop = uniq(
    openNodes
      .map(a =>
        a.length > 7 &&
        a[0] === 'Projekte' &&
        decodeURIComponent(a[2]) === 'Aktionspläne' &&
        a[4] === 'Populationen' &&
        a[6] === 'Teil-Populationen'
          ? a[7]
          : null,
      )
      .filter(v => v !== null),
  )
  const isTpop =
    isPop &&
    openNodes.some(nArray => nArray[6] === 'Teil-Populationen' && nArray[7])
  const tpopFilter = { popId: { in: pop } }
  const tpopFilterValues = Object.entries(nodeFilter.tpop).filter(
    e => e[1] || e[1] === 0,
  )
  tpopFilterValues.forEach(([key, value]) => {
    const expression = tpopType[key] === 'string' ? 'includes' : 'equalTo'
    tpopFilter[key] = { [expression]: value }
  })

  const tpopkontr = uniq(
    openNodes
      .map(a =>
        a.length > 9 &&
        a[0] === 'Projekte' &&
        decodeURIComponent(a[2]) === 'Aktionspläne' &&
        a[4] === 'Populationen' &&
        a[6] === 'Teil-Populationen' &&
        ['Feld-Kontrollen', 'Freiwilligen-Kontrollen'].includes(a[8])
          ? a[9]
          : null,
      )
      .filter(v => v !== null),
  )
  const isTpopkontr =
    isTpop &&
    openNodes.some(
      nArray =>
        ['Feld-Kontrollen', 'Freiwilligen-Kontrollen'].includes(nArray[8]) &&
        nArray[9],
    )
  const variables = {
    projekt,
    projId,
    isProjekt,
    apFilter,
    ap,
    apId,
    isAp,
    ziel,
    isZiel,
    pop,
    isPop,
    popFilter,
    tpop,
    isTpop,
    tpopFilter,
    tpopkontr,
    isTpopkontr,
    apIsActiveInMap: mapIsActive && isAp,
    isWerteListen,
    isAdresse,
  }
  //console.log('variables:', variables)
  return variables
}
