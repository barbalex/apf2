// Veränderung zum Vorjahr is calculated from the beurteilungen of this
// year's and last year's apber. Beurteilungen are compared by their sort
// value in ap_erfkrit_werte: lower sort means more successful.
// sort 6 (unsichere Entwicklung) is not comparable
export const veraenderungZumVorjahr = ({
  beurteilung,
  beurteilungVorjahr,
  sortsByCode,
}: {
  beurteilung: number | null | undefined
  beurteilungVorjahr: number | null | undefined
  sortsByCode: Map<number, number | null>
}): '+' | '-' | '=' | null => {
  if (beurteilung == null || beurteilungVorjahr == null) return null
  const sort = sortsByCode.get(beurteilung)
  const sortVorjahr = sortsByCode.get(beurteilungVorjahr)
  if (sort == null || sortVorjahr == null) return null
  if (sort === 6 || sortVorjahr === 6) return null
  if (sort < sortVorjahr) return '+'
  if (sort > sortVorjahr) return '-'
  return '='
}
