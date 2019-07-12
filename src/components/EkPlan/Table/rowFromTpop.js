import get from 'lodash/get'

import fieldsFromTpop from './fieldsFromTpop'

export default ({ tpop, years, showCount }) => {
  const ekplans = get(tpop, 'ekplansByTpopId.nodes')
  const kontrs = get(tpop, 'tpopkontrsByTpopId.nodes')
  const ansiedlungs = get(tpop, 'tpopmassnsByTpopId.nodes')

  const fields = fieldsFromTpop(tpop)
  years.forEach(
    year =>
      (fields[year.toString()] = {
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
          ek: kontrs
            .filter(o => o.jahr === year)
            .filter(o => o.typ !== 'Freiwilligen-Erfolgskontrolle'),
          ekf: kontrs
            .filter(o => o.jahr === year)
            .filter(o => o.typ === 'Freiwilligen-Erfolgskontrolle'),
          ansiedlungs: ansiedlungs.filter(o => o.jahr === year),
        },
        sort: year,
        width: showCount ? 52 : 38,
      }),
  )
  return fields
}
