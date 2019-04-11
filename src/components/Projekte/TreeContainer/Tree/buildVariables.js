// @flow
import uniq from 'lodash/uniq'

import { simpleTypes as apType } from '../../../../store/NodeFilterTree/ap'
import { simpleTypes as popType } from '../../../../store/NodeFilterTree/pop'
import { simpleTypes as tpopType } from '../../../../store/NodeFilterTree/tpop'
import { simpleTypes as tpopmassnType } from '../../../../store/NodeFilterTree/tpopmassn'
import { simpleTypes as tpopfeldkontrType } from '../../../../store/NodeFilterTree/tpopfeldkontr'
import { simpleTypes as tpopfreiwkontrType } from '../../../../store/NodeFilterTree/tpopfreiwkontr'

export default ({
  treeName,
  store,
}: {
  treeName: String,
  store: Object,
}): Object => {
  const { nodeFilter: nodeFilterPassed } = store
  // apFilter is used for form filter AND apFilter of tree :-(
  const { openNodes, activeNodeArray, apFilter: apFilterSet } = store[treeName]
  const nodeFilter = nodeFilterPassed[treeName]

  const isWerteListen = openNodes.some(
    nodeArray => nodeArray[0] === 'Werte-Listen',
  )
  const isAdresse = openNodes.some(
    nodeArray =>
      nodeArray[0] === 'Werte-Listen' &&
      activeNodeArray.length > 1 &&
      nodeArray[1] === 'Adressen',
  )
  const projekt = uniq(
    openNodes
      .map(a => (a.length > 1 && a[0] === 'Projekte' ? a[1] : null))
      .filter(v => v !== null),
  )
  let projId = '99999999-9999-9999-9999-999999999999'
  if (projekt && projekt[0]) projId = projekt[0]

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

  const tpopfeldkontrFilter = {
    or: [
      { typ: { notEqualTo: 'Freiwilligen-Erfolgskontrolle' } },
      { typ: { isNull: true } },
    ],
    tpopId: { in: tpop },
  }
  const tpopfeldkontrFilterValues = Object.entries(
    nodeFilter.tpopfeldkontr,
  ).filter(e => e[1] || e[1] === 0)
  tpopfeldkontrFilterValues.forEach(([key, value]) => {
    const expression =
      tpopfeldkontrType[key] === 'string' ? 'includes' : 'equalTo'
    tpopfeldkontrFilter[key] = { [expression]: value }
  })

  const tpopfreiwkontrFilter = {
    typ: { equalTo: 'Freiwilligen-Erfolgskontrolle' },
    tpopId: { in: tpop },
  }
  const tpopfreiwkontrFilterValues = Object.entries(
    nodeFilter.tpopfreiwkontr,
  ).filter(e => e[1] || e[1] === 0)
  tpopfreiwkontrFilterValues.forEach(([key, value]) => {
    const expression =
      tpopfreiwkontrType[key] === 'string' ? 'includes' : 'equalTo'
    tpopfreiwkontrFilter[key] = { [expression]: value }
  })

  const tpopmassnFilter = { tpopId: { in: tpop } }
  const tpopmassnFilterValues = Object.entries(nodeFilter.tpopmassn).filter(
    e => e[1] || e[1] === 0,
  )
  tpopmassnFilterValues.forEach(([key, value]) => {
    const expression = tpopmassnType[key] === 'string' ? 'includes' : 'equalTo'
    tpopmassnFilter[key] = { [expression]: value }
  })

  const variables = {
    projekt,
    isProjekt,
    apFilter,
    ap,
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
    isWerteListen,
    isAdresse,
    tpopmassnFilter,
    tpopfeldkontrFilter,
    tpopfreiwkontrFilter,
  }
  //console.log('buildVariables, variables:', variables)
  return variables
}
