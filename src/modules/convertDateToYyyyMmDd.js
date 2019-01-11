// @flow
/**
 * would prefer to use data-fns for this but is not yet possible, see:
 * https://github.com/date-fns/date-fns/issues/219
 *
 * Actually: moment not only parses the date. Which data-fns v2 can.
 * It also gets "3", "3.1", 3.1.17" and adds missing month / year from now
 * This is great and not possible with date-fns?
 */

import moment from 'moment'

export default function convertDateToYyyyMmDd(date: string): string {
  // make sure not to convert empty values
  if (!date) return ''

  return moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD')
}
