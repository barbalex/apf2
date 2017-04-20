// @flow
/**
 * would prefer to use data-fns for this but is not yet possible, see:
 * https://github.com/date-fns/date-fns/issues/219
 */

import moment from 'moment'

export default function convertDateToYyyyMmDd(date: string): string {
  // make sure not to convert empty values
  if (!date) return ''
  return moment(date, `DD.MM.YYYY`).format(`YYYY-MM-DD`)
}
