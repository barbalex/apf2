// @flow
import clone from 'lodash/clone'
import { toJS } from 'mobx'

export default (store:Object, tree:Object, key:string, valuePassed:string|number) => {
  const { table, row } = tree.activeDataset
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
    const newActiveNodeArray = clone(toJS(tree.activeNodeArray))
    newActiveNodeArray[5] = value
    tree.setActiveNodeArray(newActiveNodeArray)
  }
  row[key] = value
}
