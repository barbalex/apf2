// @flow
/**
* moves a dataset to a different parent
* used when copying for instance tpop to other pop in tree
*/

import axios from 'axios'
import clone from 'lodash/clone'

import apiBaseUrl from '../../modules/apiBaseUrl'
import tables from '../../modules/tables'
import insertDatasetInIdb from './insertDatasetInIdb'

export default (store: Object, parentId: number): void => {
  let { table } = store.copying
  const { id } = store.copying

  // ensure derived data exists
  const tabelle = tables.find(t => t.table === table)
  // in tpopfeldkontr and tpopfreiwkontr need to find dbTable
  if (tabelle.dbTable) {
    table = tabelle.dbTable
  }
  const idField = tabelle ? tabelle.idField : undefined
  if (!idField) {
    return store.listError(
      new Error(
        // $FlowIssue
        `change was not saved because idField was not found`
      )
    )
  }
  const parentIdField = tabelle.parentIdField
  if (!parentIdField) {
    return store.listError(
      new Error(`change was not saved because parentIdField was not found`)
    )
  }

  const row = store.table[table].get(id)
  if (!row) {
    return store.listError(
      new Error(`change was not saved because dataset was not found in store`)
    )
  }

  // build new row (for now without idField)
  const newRow = clone(row)
  // need to remove empty values and guids
  Object.keys(newRow).forEach(k => {
    if ((!newRow[k] && newRow[k] !== 0) || k.endsWith(`Guid`)) {
      delete newRow[k]
    }
  })
  newRow[parentIdField] = parentId
  delete newRow[idField]
  // remove label: field does not exist in db, is computed
  delete newRow.label
  delete newRow.PopKoordWgs84

  // update db
  const url = `${apiBaseUrl}/insertFields/apflora/tabelle=${table}/felder=${JSON.stringify(newRow)}`
  axios
    .post(url)
    .then(({ data }) => {
      // can't write to store before, because db creates id and guid
      store.writeToStore({ data: [data], table, field: idField })
      // insert this dataset in idb
      insertDatasetInIdb(store, table, data)
    })
    .catch(error => store.listError(error))
}
