import get from 'lodash/get'
import sum from 'lodash/sum'

import appBaseUrl from '../../../modules/appBaseUrl'

export default ({ tpop, dataLists, years, store }) => {
  const { einheitsByAp } = store.ekPlan
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
  const einheits = einheitsByAp[row.apId]

  years.forEach(year => {
    const ekplanCount = ekplans
      .filter(o => o.jahr === year)
      .filter(o => o.typ === 'EK').length
    row[`_${year}_EK_geplant`] = ekplanCount > 0 ? ekplanCount : ''

    const eks = kontrs
      .filter(o => o.jahr === year)
      .filter(o => o.typ !== 'Freiwilligen-Erfolgskontrolle')
    const eksCount = eks.length
    row[`_${year}_EK`] = eksCount > 0 ? eksCount : ''

    const ekSumCounted = sum(
      eks.flatMap(ek =>
        get(ek, 'tpopkontrzaehlsByTpopkontrId.nodes', [])
          .filter(
            z =>
              einheits.includes(z.einheit) &&
              z.anzahl !== null &&
              get(
                z,
                'tpopkontrzaehlEinheitWerteByEinheit.ekzaehleinheitsByZaehleinheitId.nodes',
                [],
              ).length > 0,
          )
          .flatMap(z => z.anzahl),
      ),
    )
    row[`_${year}_EK_Anzahl`] = ekSumCounted > 0 ? ekSumCounted : ''

    const ekfPlanCount = ekplans
      .filter(o => o.jahr === year)
      .filter(o => o.typ === 'EKF').length
    row[`_${year}_EKF_geplant`] = ekfPlanCount > 0 ? ekfPlanCount : ''

    const ekfs = kontrs
      .filter(o => o.jahr === year)
      .filter(o => o.typ === 'Freiwilligen-Erfolgskontrolle')
    const ekfsCount = ekfs.length
    row[`_${year}_EKF`] = ekfsCount > 0 ? ekfsCount : ''

    const ekfSumCounted = sum(
      ekfs.flatMap(ek =>
        get(ek, 'tpopkontrzaehlsByTpopkontrId.nodes', [])
          .filter(
            z =>
              einheits.includes(z.einheit) &&
              z.anzahl !== null &&
              get(
                z,
                'tpopkontrzaehlEinheitWerteByEinheit.ekzaehleinheitsByZaehleinheitId.nodes',
                [],
              ).length > 0,
          )
          .flatMap(z => z.anzahl),
      ),
    )
    row[`_${year}_EKF_Anzahl`] = ekfSumCounted > 0 ? ekfSumCounted : ''

    const ansiedlungsOfYear = ansiedlungs.filter(o => o.jahr === year)
    const ansiedlungsCount = ansiedlungsOfYear.length
    row[`_${year}_Ansiedlungen`] = ansiedlungsCount > 0 ? ansiedlungsCount : ''

    const ansiedlungsSumCounted = sum(
      ansiedlungsOfYear
        .filter(ans => ans.anzTriebe !== null || ans.anzPflanzen !== null)
        .map(
          ans =>
            (ans.anzTriebe !== null ? ans.anzTriebe : 0) +
            (ans.anzPflanzen !== null ? ans.anzPflanzen : 0),
        ),
    )
    row[`_${year}_Ansiedlungen_Anzahl`] =
      ansiedlungsSumCounted > 0 ? ansiedlungsSumCounted : ''
  })
  return row
}
