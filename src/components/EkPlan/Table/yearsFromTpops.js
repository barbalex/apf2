import get from 'lodash/get'
import minBy from 'lodash/minBy'
import min from 'lodash/min'

export default ({ tpops, pastYears }) => {
  const ekplans = tpops.flatMap((tpop) => get(tpop, 'ekplansByTpopId.nodes'))
  const kontrs = tpops.flatMap((tpop) => get(tpop, 'tpopkontrsByTpopId.nodes'))
  const massns = tpops.flatMap((tpop) => get(tpop, 'tpopmassnsByTpopId.nodes'))
  const firstEk = minBy([...ekplans, ...kontrs], 'jahr')
  const firstMassn = minBy([...ekplans, ...massns], 'jahr')
  const currentYear = new Date().getFullYear()
  const firstEkYear = firstEk ? firstEk.jahr : 999999
  const firstMassnYear = firstEk ? firstMassn.jahr : 999999
  // ensure never before 1993
  let firstYear = min([firstEkYear, firstMassnYear])
  let lastYear = currentYear + 15
  if (pastYears < 0) lastYear = lastYear - pastYears

  const years = []
  while (firstYear <= lastYear) {
    years.push(firstYear++)
  }
  return years
}
