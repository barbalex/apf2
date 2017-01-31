// @flow
/**
 * This was to try to add computeds to rows
 * did not work though as rows lost their
 * observability!!!!
 */
import { extendObservable, computed } from 'mobx'
import clone from 'lodash/clone'

import epsg21781to4326 from '../modules/epsg21781to4326'

const initiateRow = (rowPassed:Object) => {
  const row = clone(rowPassed)
  // if tableName === tpop or pop, set coord wgs84
  if (row.PopXKoord && row.PopYKoord) {
    extendObservable(row, {
      PopKoordWgs84: computed(() =>
        epsg21781to4326(row.PopXKoord, row.PopYKoord)
      )
    })
  }
  if (row.TPopXKoord && row.TPopYKoord) {
    extendObservable(row, {
      TPopKoordWgs84: computed(() =>
        epsg21781to4326(row.TPopXKoord, row.TPopYKoord)
      )
    })
  }
  return row
}

export default initiateRow
