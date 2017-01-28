// @flow
import queryString from 'query-string'

export default (store:Object, key:string, valuePassed:string|number) => {
  const { table, row } = store.activeDataset
  let value = valuePassed
  // ensure primary data exists
  if (!key || !table || !row) {
    return store.listError(
      new Error(
        `change was not saved as one or more of the following values were not passed:
        field: "${key}", table: "${table}", value: "${value}"`
      )
    )
  }
  // ensure numbers saved as numbers
  if (value && !isNaN(value)) {
    value = +value
  }
  // edge cases:
  // if jahr of ziel is updated, url needs to change
  if (table === `ziel` && key === `ZielJahr`) {
    store.url[5] = value
    const newUrl = `/${store.url.join(`/`)}${Object.keys(store.urlQuery).length > 0 ? `?${queryString.stringify(store.urlQuery)}` : ``}`
    store.history.push(newUrl)
  }
  row[key] = value
}
