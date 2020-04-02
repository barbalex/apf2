import get from 'lodash/get'
import sum from 'lodash/sum'

import appBaseUrl from '../../../modules/appBaseUrl'

export default ({ tpop, dataLists, years, store }) => {
  const {
    einheitsByAp,
    showCount,
    fields,
    showEk,
    showEkf,
    showMassn,
    ekfrequenzs,
  } = store.ekPlan
  const row = {
    apId: get(tpop, 'popByPopId.apByApId.id'),
  }
  if (fields.includes('ap')) {
    row.apName = get(tpop, 'popByPopId.apByApId.label')
  }
  row.popId = get(tpop, 'popByPopId.id')
  if (fields.includes('popNr')) {
    row.popNr = get(tpop, 'popByPopId.nr') || '-'
  }
  if (fields.includes('popName')) {
    row.popName = get(tpop, 'popByPopId.name') || '-'
  }
  if (fields.includes('popStatus')) {
    row.popStatus = get(tpop, 'popByPopId.popStatusWerteByStatus.text') || '-'
  }
  row.tpopId = tpop.id
  if (fields.includes('nr')) {
    row.tpopNr = get(tpop, 'nr') || '-'
  }
  if (fields.includes('gemeinde')) {
    row.tpopGemeinde = get(tpop, 'gemeinde') || '-'
  }
  if (fields.includes('flurname')) {
    row.tpopFlurname = get(tpop, 'flurname') || '-'
  }
  if (fields.includes('status')) {
    row.tpopStatus = get(tpop, 'popStatusWerteByStatus.text') || '-'
  }
  // check till here
  if (fields.includes('bekanntSeit')) {
    row.tpopBekanntSeit = get(tpop, 'bekanntSeit') || '-'
  }
  if (fields.includes('lv95X')) {
    row.lv95X = get(tpop, 'lv95X') || '-'
  }
  if (fields.includes('lv95Y')) {
    row.lv95Y = get(tpop, 'lv95Y') || '-'
  }
  if (fields.includes('link')) {
    row.tpopLink = `${appBaseUrl()}Daten/Projekte/${
      tpop.popByPopId.apByApId.projId
    }/Aktionspläne/${tpop.popByPopId.apByApId.id}/Populationen/${
      tpop.popByPopId.id
    }/Teil-Populationen/${tpop.id}`
  }
  if (fields.includes('ekAbrechnungstyp')) {
    row.ekAbrechnungstyp = get(
      get(dataLists, 'allEkfrequenzs.nodes', []).find(
        e => e.id === get(tpop, 'ekfrequenz'),
      ),
      'ekAbrechnungstypWerteByEkAbrechnungstyp.text',
    )
  }
  if (fields.includes('ekfrequenz')) {
    let ekfrequenz = get(tpop, 'ekfrequenz') || null
    if (ekfrequenz) {
      ekfrequenz = get(
        ekfrequenzs.find(f => f.id === ekfrequenz),
        'code',
        null,
      )
    }
    row.ekfrequenz = ekfrequenz
  }
  if (fields.includes('ekfrequenzStartjahr')) {
    row.ekfrequenzStartjahr = get(tpop, 'ekfrequenzStartjahr') || null
  }
  if (fields.includes('ekfrequenzAbweichend')) {
    row.ekfrequenzAbweichend = get(tpop, 'ekfrequenzAbweichend') === true
  }

  const ekplans = get(tpop, 'ekplansByTpopId.nodes')
  const kontrs = get(tpop, 'tpopkontrsByTpopId.nodes')
  const ansiedlungs = get(tpop, 'tpopmassnsByTpopId.nodes')
  const einheits = einheitsByAp[row.apId]

  years.forEach(year => {
    if (showEk) {
      const ekplanCount = ekplans
        .filter(o => o.jahr === year)
        .filter(o => o.typ === 'EK').length
      row[`${year}_EK_geplant`] = ekplanCount > 0 ? ekplanCount : ''

      const eks = kontrs
        .filter(o => o.jahr === year)
        .filter(o => o.typ !== 'Freiwilligen-Erfolgskontrolle')
      const eksCount = eks.length
      row[`${year}_EK`] = eksCount > 0 ? eksCount : ''

      if (showCount) {
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
        row[`${year}_EK_Anzahl`] = ekSumCounted > 0 ? ekSumCounted : ''
      }
    }

    if (showEkf) {
      const ekfPlanCount = ekplans
        .filter(o => o.jahr === year)
        .filter(o => o.typ === 'EKF').length
      row[`${year}_EKF_geplant`] = ekfPlanCount > 0 ? ekfPlanCount : ''

      const ekfs = kontrs
        .filter(o => o.jahr === year)
        .filter(o => o.typ === 'Freiwilligen-Erfolgskontrolle')
      const ekfsCount = ekfs.length
      row[`${year}_EKF`] = ekfsCount > 0 ? ekfsCount : ''

      if (showCount) {
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
        row[`${year}_EKF_Anzahl`] = ekfSumCounted > 0 ? ekfSumCounted : ''
      }
    }

    if (showMassn) {
      const ansiedlungsOfYear = ansiedlungs.filter(o => o.jahr === year)
      const ansiedlungsCount = ansiedlungsOfYear.length
      row[`${year}_Ansiedlungen`] = ansiedlungsCount > 0 ? ansiedlungsCount : ''

      if (showCount) {
        const ansiedlungsSumCounted = sum(
          ansiedlungsOfYear
            .filter(ans => ans.anzTriebe !== null || ans.anzPflanzen !== null)
            .map(
              ans =>
                (ans.anzTriebe !== null ? ans.anzTriebe : 0) +
                (ans.anzPflanzen !== null ? ans.anzPflanzen : 0),
            ),
        )
        row[`${year}_Ansiedlungen_Anzahl`] =
          ansiedlungsSumCounted > 0 ? ansiedlungsSumCounted : ''
      }
    }
  })
  return row
}
