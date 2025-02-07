import { yearColumnWidth } from './yearColumnWidth.js'
import { fields } from './fields.js'

const isOdd = (num) => num % 2 === 0

export const yearRowFromTpop = ({ tpop, years, index }) => {
  const row = {
    isOdd: isOdd(index),
    id: tpop.id,
    tpop: tpop,
    apId: tpop?.popByPopId?.apByApId?.id,
    ap: {
      ...fields.ap,
      value: tpop?.popByPopId?.apByApId?.label,
    },
    popNr: {
      ...fields.popNr,
      value: tpop?.popByPopId?.nr ?? '-',
    },
    nr: {
      ...fields.nr,
      value: tpop?.nr ?? '-',
    },
  }
  years.forEach(
    (year) =>
      (row[year.toString()] = {
        name: year,
        label: year,
        alwaysShow: true,
        sort: year,
        width: yearColumnWidth,
      }),
  )

  return row
}
