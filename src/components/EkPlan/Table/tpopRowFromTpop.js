import get from 'lodash/get'

import fields from './fields'
import appBaseUrl from '../../../modules/appBaseUrl'

const isOdd = num => num % 2 === 0

export default ({ tpop, index, dataLists }) => ({
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
    value: get(
      get(dataLists, 'allEkfrequenzs.nodes', []).find(
        e => e.code === get(tpop, 'ekfrequenz'),
      ),
      'ekAbrechnungstypWerteByEkAbrechnungstyp.text',
    ),
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
})
