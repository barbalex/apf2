// @flow
/**
* moves a dataset to a different parent
* used when copying for instance tpop to other pop in tree
*/

import axios from 'axios'
import clone from 'lodash/clone'

import tables from '../../modules/tables'

export default async (store: Object, parentId: number): Promise<void> => {
  let { table } = store.copying
  const { id } = store.copying

  // ensure derived data exists
  const tabelle = tables.find(t => t.table === table)
  // in tpopfeldkontr and tpopfreiwkontr need to find dbTable
  // $FlowIssue
  if (tabelle.dbTable) {
    table = tabelle.dbTable
  }
  const idField = tabelle ? tabelle.idField : undefined
  if (!idField) {
    return store.listError(
      new Error('change was not saved because idField was not found')
    )
  }
  // $FlowIssue
  const parentIdField = tabelle.parentIdField
  if (!parentIdField) {
    return store.listError(
      new Error('change was not saved because parentIdField was not found')
    )
  }

  const row = store.table[table].get(id)
  if (!row) {
    return store.listError(
      new Error('change was not saved because dataset was not found in store')
    )
  }

  // build new row (for now without idField)
  const newRow = clone(row)
  // need to remove empty values and guids
  Object.keys(newRow).forEach(k => {
    const val = newRow[k]
    // check for uuid
    // see: https://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
    const valueIsGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      val
    )
    if ((!newRow[k] && newRow[k] !== 0) || valueIsGuid) {
      delete newRow[k]
    }
  })
  newRow[parentIdField] = parentId
  delete newRow[idField]
  // remove label: field does not exist in db, is computed
  delete newRow.label
  delete newRow.PopKoordWgs84

  // update db
  const url = `/insertFields/apflora/tabelle=${table}/felder=${JSON.stringify(
    newRow
  )}`
  let response
  try {
    response = await axios.post(url)
  } catch (error) {
    store.listError(error)
  }
  const { data } = response
  // can't write to store before, because db creates id and guid
  store.writeToStore({ data: [data], table, field: idField })
}
