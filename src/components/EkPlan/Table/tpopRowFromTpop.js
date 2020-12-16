import get from 'lodash/get'

import fields from './fields'
import appBaseUrl from '../../../modules/appBaseUrl'

const isOdd = (num) => num % 2 === 0

export default ({ tpop, index, dataLists }) => {
  let lv95X = get(tpop, 'lv95X')
  if (lv95X && lv95X.toLocaleString) {
    lv95X = lv95X.toLocaleString('de-ch')
  } else {
    lv95X = '-'
  }
  let lv95Y = get(tpop, 'lv95Y')
  if (lv95Y && lv95Y.toLocaleString) {
    lv95Y = lv95Y.toLocaleString('de-ch')
  } else {
    lv95Y = '-'
  }

  return {
    isOdd: isOdd(index),
    id: tpop.id,
    tpop: tpop,
    apId: get(tpop, 'popByPopId.apByApId.id'),
    ap: {
      ...fields.ap,
      value: get(tpop, 'popByPopId.apByApId.label'),
    },
    popNr: {
      ...fields.popNr,
      value: get(tpop, 'popByPopId.nr') || '-',
    },
    popName: {
      ...fields.popName,
      value: get(tpop, 'popByPopId.name') || '-',
    },
    popStatus: {
      ...fields.popStatus,
      value: get(tpop, 'popByPopId.popStatusWerteByStatus.text') || '-',
    },
    nr: {
      ...fields.nr,
      value: get(tpop, 'nr') || '-',
    },
    gemeinde: {
      ...fields.gemeinde,
      value: get(tpop, 'gemeinde') || '-',
    },
    flurname: {
      ...fields.flurname,
      value: get(tpop, 'flurname') || '-',
    },
    status: {
      ...fields.status,
      value: get(tpop, 'popStatusWerteByStatus.text') || '-',
    },
    bekanntSeit: {
      ...fields.bekanntSeit,
      value: get(tpop, 'bekanntSeit') || '-',
    },
    lv95X: {
      ...fields.lv95X,
      value: lv95X,
    },
    lv95Y: {
      ...fields.lv95Y,
      value: lv95Y,
    },
    link: {
      ...fields.link,
      value: `${appBaseUrl()}Daten/Projekte/${
        tpop.popByPopId.apByApId.projId
      }/Aktionspläne/${tpop.popByPopId.apByApId.id}/Populationen/${
        tpop.popByPopId.id
      }/Teil-Populationen/${tpop.id}`,
    },
    ekAbrechnungstyp: {
      ...fields.ekAbrechnungstyp,
      value:
        tpop?.ekfrequenzByEkfrequenz?.ekAbrechnungstypWerteByEkAbrechnungstyp
          ?.text ?? '',
    },
    ekfrequenz: {
      ...fields.ekfrequenz,
      value: get(tpop, 'ekfrequenz') || null,
    },
    ekfrequenzStartjahr: {
      ...fields.ekfrequenzStartjahr,
      value: get(tpop, 'ekfrequenzStartjahr') || null,
    },
    ekfrequenzAbweichend: {
      ...fields.ekfrequenzAbweichend,
      value: get(tpop, 'ekfrequenzAbweichend') === true,
    },
    yearTitle: fields.yearTitle,
  }
}
