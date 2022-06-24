import fields from './fields'
import appBaseUrl from '../../../modules/appBaseUrl'

const isOdd = (num) => num % 2 === 0

const tpopRowFromTpop = ({ tpop, index }) => {
  let lv95X = tpop?.lv95X
  if (lv95X && lv95X.toLocaleString) {
    lv95X = lv95X.toLocaleString('de-ch')
  } else {
    lv95X = '-'
  }
  let lv95Y = tpop?.lv95Y
  if (lv95Y && lv95Y.toLocaleString) {
    lv95Y = lv95Y.toLocaleString('de-ch')
  } else {
    lv95Y = '-'
  }

  return {
    isOdd: isOdd(index),
    id: tpop.id,
    tpop: tpop,
    apId: tpop?.popByPopId?.apByApId?.id,
    ap: {
      ...fields.ap,
      value: tpop?.popByPopId?.apByApId?.label,
    },
    popNr: {
      ...fields.popNr,
      value: tpop?.popByPopId?.nr ?? '-',
    },
    popName: {
      ...fields.popName,
      value: tpop?.popByPopId?.name ?? '-',
    },
    popStatus: {
      ...fields.popStatus,
      value: tpop?.popByPopId?.popStatusWerteByStatus?.text ?? '-',
    },
    nr: {
      ...fields.nr,
      value: tpop?.nr ?? '-',
    },
    gemeinde: {
      ...fields.gemeinde,
      value: tpop?.gemeinde ?? '-',
    },
    flurname: {
      ...fields.flurname,
      value: tpop?.flurname ?? '-',
    },
    status: {
      ...fields.status,
      value: tpop?.popStatusWerteByStatus?.text ?? '-',
    },
    bekanntSeit: {
      ...fields.bekanntSeit,
      value: tpop?.bekanntSeit ?? '-',
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
      }/Arten/${tpop.popByPopId.apByApId.id}/Populationen/${
        tpop.popByPopId.id
      }/Teil-Populationen/${tpop.id}`,
    },
    ekfKontrolleur: {
      ...fields.ekfKontrolleur,
      value: tpop?.adresseByEkfKontrolleur?.name,
    },
    ekAbrechnungstyp: {
      ...fields.ekAbrechnungstyp,
      value:
        tpop?.ekfrequenzByEkfrequenz?.ekAbrechnungstypWerteByEkAbrechnungstyp
          ?.text ?? '',
    },
    ekfrequenz: {
      ...fields.ekfrequenz,
      value: tpop?.ekfrequenz ?? null,
    },
    ekfrequenzStartjahr: {
      ...fields.ekfrequenzStartjahr,
      value: tpop?.ekfrequenzStartjahr ?? null,
    },
    ekfrequenzAbweichend: {
      ...fields.ekfrequenzAbweichend,
      value: tpop?.ekfrequenzAbweichend === true,
    },
    yearTitle: fields.yearTitle,
  }
}

export default tpopRowFromTpop
