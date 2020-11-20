import minBy from 'lodash/minBy'
import min from 'lodash/min'

const yearsFromTpops = ({ tpops, pastYears }) => {
  const ekplans = tpops.flatMap((tpop) => tpop?.ekplansByTpopId?.nodes ?? [])
  const kontrs = tpops.flatMap((tpop) => tpop?.tpopkontrsByTpopId?.nodes ?? [])
  const massns = tpops.flatMap((tpop) => tpop?.tpopmassnsByTpopId?.nodes ?? [])
  const firstEk = minBy([...ekplans, ...kontrs], 'jahr')
  const firstMassn = minBy([...ekplans, ...massns], 'jahr')
  const currentYear = new Date().getFullYear()
  const firstEkYear = firstEk?.jahr ?? 999999
  const firstMassnYear = firstMassn?.jahr ?? 999999
  let firstYear = min([firstEkYear, firstMassnYear])
  let lastYear = currentYear + 15
  if (pastYears < 0) lastYear = lastYear - pastYears

  const years = []
  while (firstYear <= lastYear) {
    years.push(firstYear++)
  }
  return years
}

export default yearsFromTpops
