// @flow
/**
* moves a dataset to a different parent
* used when copying for instance tpop to other pop in tree
*/

import axios from 'axios'
import clone from 'lodash/clone'

import tables from '../../modules/tables'
import copyTpopsOfPop from './copyTpopsOfPop'

// copyTpopsOfPop can pass table and id separately
export default async (
  store: Object,
  parentId: number,
  tablePassed: ?string,
  idPassed: ?number
): Promise<void> => {
  let { table, withNextLevel } = store.copying
  if (tablePassed) table = tablePassed
  let { id } = store.copying
  if (idPassed) id = idPassed

  // ensure derived data exists
  const tabelle = tables.find(t => t.table === table)
  // in tpopfeldkontr and tpopfreiwkontr need to find dbTable
  if (tabelle && tabelle.dbTable) {
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
  delete newRow.TPopKoordWgs84

  // update db
  let response
  try {
    response = await axios({
      method: 'POST',
      url: `/${table}`,
      data: newRow,
      headers: {
        Prefer: 'return=representation',
      },
    })
  } catch (error) {
    store.listError(error)
  }
  // $FlowIssue
  const data = response.data[0]
  // can't write to store before, because db creates id and guid
  store.writeToStore({ data: [data], table, field: idField })
  // check if need to copy tpop
  if (table === 'pop' && withNextLevel) {
    copyTpopsOfPop({ store, popIdFrom: id, popIdTo: data.PopId })
  }
}
