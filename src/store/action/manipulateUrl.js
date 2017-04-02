// @flow
import isEqual from 'lodash/isEqual'
import clone from 'lodash/clone'
import queryString from 'query-string'

export default (store:Object) => {
  const activeNodeArray = clone(store.activeNodeArray)
  // forward apflora.ch to Projekte
  if (activeNodeArray.length === 0) {
    activeNodeArray.push(`Projekte`)
  }

  // if new store set projekte tabs
  const urlQuery = clone(store.urlQuery)
  if (
    (activeNodeArray.length === 0 || activeNodeArray[0] === `Projekte`) &&
    !urlQuery.projekteTabs
  ) {
    urlQuery.projekteTabs = [`strukturbaum`, `daten`]
  }
  const search = queryString.stringify(urlQuery)
  if (
    !isEqual(activeNodeArray, store.activeNodeArray) ||
    !isEqual(urlQuery, store.urlQuery)
  ) {
    const query = `${Object.keys(urlQuery).length > 0 ? `?${search}` : ``}`
    store.history.push(`/${activeNodeArray.join(`/`)}${query}`)
  }
}
