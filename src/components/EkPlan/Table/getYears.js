/**
 * used to automatically set first year depending on first kontrs or first massns
 * but now users set first shown year via pastYears
 */
export const getYears = (pastYears) => {
  const currentYear = new Date().getFullYear()
  let firstYear = currentYear - pastYears
  let lastYear = currentYear + 15
  if (pastYears < 0) lastYear = lastYear - pastYears

  const years = []
  while (firstYear <= lastYear) {
    years.push(firstYear++)
  }

  return years
}
