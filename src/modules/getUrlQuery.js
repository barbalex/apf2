// @flow
import isString from 'lodash/isString'
import queryString from 'query-string'

export default (): string => {
  const query = queryString.parse(window.location.search)
  /**
   * arrays are converted to strings in url if only one element is contained
   * need to convert it to array
   */
  if (query.projekteTabs && isString(query.projekteTabs)) {
    query.projekteTabs = [query.projekteTabs]
  }
  return query
}
