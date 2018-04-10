// @flow
import clone from 'lodash/clone'
import { toJS } from 'mobx'

export default (
  store: Object,
  tree: Object,
  key: string,
  valuePassed: string | number
): void => {
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
  // edge cases:
  // if jahr of ziel is updated, url needs to change
  if (table === 'ziel' && key === 'jahr') {
    const newActiveNodeArray = clone(toJS(tree.activeNodeArray))
    newActiveNodeArray[5] = value
    tree.setActiveNodeArray(newActiveNodeArray)
  }
  row[key] = value
}
