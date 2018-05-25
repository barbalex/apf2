// @flow
import uniq from 'lodash/uniq'

export default (openNodes: Array<Array<mixed>>): Object => {
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
    isProjekt: projekt.length > 0,
    ap,
    isAp: ap.length > 0,
    ziel,
    isZiel: ziel.length > 0,
    pop,
    isPop: pop.length > 0,
    tpop,
    isTpop: tpop.length > 0,
    tpopkontr,
    isTpopkontr: tpopkontr.length > 0,
  }
  console.log('variables:', variables)
  return variables
}
