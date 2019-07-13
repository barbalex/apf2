import get from 'lodash/get'

import yearColumnWidth from './yearColumnWidth'
import fields from './fields'

const isOdd = num => num % 2 === 0

export default ({ tpop, years, showCount, index }) => {
  const ekplans = get(tpop, 'ekplansByTpopId.nodes')
  const kontrs = get(tpop, 'tpopkontrsByTpopId.nodes')
  const ansiedlungs = get(tpop, 'tpopmassnsByTpopId.nodes')

  const row = {
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
    nr: {
      ...fields.nr,
      value: get(tpop, 'nr') || '-',
    },
  }
  years.forEach(
    year =>
      (row[year.toString()] = {
        name: year,
        label: year,
        alwaysShow: true,
        value: {
          ekPlan:
            ekplans.filter(o => o.jahr === year).filter(o => o.typ === 'EK')
              .length > 0,
          ekfPlan:
            ekplans.filter(o => o.jahr === year).filter(o => o.typ === 'EKF')
              .length > 0,
          eks: kontrs
            .filter(o => o.jahr === year)
            .filter(o => o.typ !== 'Freiwilligen-Erfolgskontrolle'),
          ekfs: kontrs
            .filter(o => o.jahr === year)
            .filter(o => o.typ === 'Freiwilligen-Erfolgskontrolle'),
          ansiedlungs: ansiedlungs.filter(o => o.jahr === year),
        },
        sort: year,
        width: yearColumnWidth(showCount),
      }),
  )
  return row
}
