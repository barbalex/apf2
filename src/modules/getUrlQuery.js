// @flow
import isString from 'lodash/isString'
import queryString from 'query-string'

export default (): String => {
  const query = queryString.parse(window.location.search)
  // on initial load an empty object can be returned
  // set initial values
  if (!query.projekteTabs) query.projekteTabs = ['tree', 'daten']
  if (!query.feldkontrTab) query.feldkontrTab = 'entwicklung'
  /**
   * arrays are converted to strings in url if only one element is contained
   * need to convert it to array
   */
  if (query.projekteTabs && isString(query.projekteTabs)) {
    query.projekteTabs = [query.projekteTabs]
  }
  console.log('getUrlQuery:', { queryFromUrl: queryString.parse(window.location.search), queryReturned: query })
  return query
}
