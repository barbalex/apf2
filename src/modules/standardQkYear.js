// @flow
//import dateFns from 'date-fns'

export default () => {
  const refDate = new Date()
  refDate.setMonth(refDate.getMonth() - 6)
  // return parseInt(dateFns.format(refDate, 'YYYY'), 10)
  return refDate.getFullYear()
}
