import get from 'lodash/get'

import appBaseUrl from '../../../modules/appBaseUrl'

export default ({ tpop, dataLists, years }) => {
  const row = {
    apId: get(tpop, 'popByPopId.apByApId.id'),
    apName: get(tpop, 'popByPopId.apByApId.label'),
    popId: get(tpop, 'popByPopId.id'),
    popNr: get(tpop, 'popByPopId.nr') || '-',
    popName: get(tpop, 'popByPopId.name') || '-',
    popStatus: get(tpop, 'popByPopId.popStatusWerteByStatus.text') || '-',
    tpopId: tpop.id,
    tpopNr: get(tpop, 'nr') || '-',
    tpopGemeinde: get(tpop, 'gemeinde') || '-',
    tpopFlurname: get(tpop, 'flurname') || '-',
    tpopStatus: get(tpop, 'popStatusWerteByStatus.text') || '-',
    tpopBekanntSeit: get(tpop, 'bekanntSeit') || '-',
    tpopLink: `${appBaseUrl()}Daten/Projekte/${
      tpop.popByPopId.apByApId.projId
    }/Aktionspläne/${tpop.popByPopId.apByApId.id}/Populationen/${
      tpop.popByPopId.id
    }/Teil-Populationen/${tpop.id}`,
    ekAbrechnungstyp: get(
      get(dataLists, 'allEkfrequenzs.nodes', []).find(
        e => e.id === get(tpop, 'ekfrequenz'),
      ),
      'ekAbrechnungstypWerteByEkAbrechnungstyp.text',
    ),
    ekfrequenz: get(tpop, 'ekfrequenz') || null,
    ekfrequenzStartjahr: get(tpop, 'ekfrequenzStartjahr') || null,
    ekfrequenzAbweichend: get(tpop, 'ekfrequenzAbweichend') === true,
  }

  const ekplans = get(tpop, 'ekplansByTpopId.nodes')
  const kontrs = get(tpop, 'tpopkontrsByTpopId.nodes')
  const ansiedlungs = get(tpop, 'tpopmassnsByTpopId.nodes')

  years.forEach(year => {
    const ekplanCount = ekplans
      .filter(o => o.jahr === year)
      .filter(o => o.typ === 'EK').length
    row[`_${year}_EK_geplant`] = ekplanCount > 0 ? ekplanCount : ''
    const eksCount = kontrs
      .filter(o => o.jahr === year)
      .filter(o => o.typ !== 'Freiwilligen-Erfolgskontrolle').length
    row[`_${year}_EK`] = eksCount > 0 ? eksCount : ''
    const ekfPlanCount = ekplans
      .filter(o => o.jahr === year)
      .filter(o => o.typ === 'EKF').length
    row[`_${year}_EKF_geplant`] = ekfPlanCount > 0 ? ekfPlanCount : ''
    const ekfsCount = kontrs
      .filter(o => o.jahr === year)
      .filter(o => o.typ === 'Freiwilligen-Erfolgskontrolle')
    row[`_${year}_EKF`] = ekfsCount > 0 ? ekfsCount : ''
    const ansiedlungsCount = ansiedlungs.filter(o => o.jahr === year).length
    row[`_${year}_Ansiedlungen`] = ansiedlungsCount > 0 ? ansiedlungsCount : ''
  })
  return row
}
