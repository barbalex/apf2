import isString from 'lodash/isString'
import queryString from 'query-string'

export default () => {
  const query =
    typeof window !== 'undefined'
      ? queryString.parse(window.location.search)
      : {}
  // on initial load an empty object can be returned
  // set initial values
  if (!query.projekteTabs) query.projekteTabs = ['tree', 'daten']
  if (!query.feldkontrTab) query.feldkontrTab = 'entwicklung'
  if (!query.popTab) query.popTab = 'pop'
  if (!query.tpopTab) query.tpopTab = 'tpop'
  if (!query.tpopmassnTab) query.tpopmassnTab = 'tpopmassn'
  if (!query.apTab) query.apTab = 'ap'
  if (!query.qkTab) query.qkTab = 'qk'
  if (!query.idealbiotopTab) query.idealbiotopTab = 'idealbiotop'
  /**
   * arrays are converted to strings in url if only one element is contained
   * need to convert it to array
   */
  if (query.projekteTabs && isString(query.projekteTabs)) {
    query.projekteTabs = [query.projekteTabs]
  }
  return query
}
