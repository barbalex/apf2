// @flow
import axios from 'axios'
import objectValues from 'lodash/values'
import clone from 'lodash/clone'
import { toJS } from 'mobx'

import tables from '../../modules/tables'

export default async (
  store: Object,
  tree: Object,
  key: String,
  valuePassed: String | Number
): any => {
  const { row, valid } = tree.activeDataset
  let value = valuePassed
  let table = tree.activeDataset.table

  // ensure primary data exists
  if (!key || !table || !row) {
    return
  }

  // convert undefined and '' to null
  if (value === undefined || value === '') {
    value = null
  }

  // ensure derived data exists
  const tabelle: {
    table: string,
    dbTable: ?string,
    idField: string,
  } = tables.find(t => t.table === table)
  // in tpopfeldkontr and tpopfreiwkontr need to find dbTable
  if (tabelle.dbTable) {
    table = tabelle.dbTable
  }
  const idField = tabelle ? tabelle.idField : undefined
  if (!idField) {
    return store.listError(
      new Error(
        `change was not saved:
        field: ${key}, table: ${table}, value: ${value}
        Reason: idField was not found`
      )
    )
  }
  const tabelleId = row[idField]
  if (!tabelleId && tabelleId !== 0) {
    return store.listError(
      new Error(
        `change was not saved:
        field: ${key}, table: ${table}, value: ${value}
        Reason: tabelleId was not found`
      )
    )
  }

  // update if no validation messages exist
  const combinedValidationMessages = objectValues(valid).join('')
  if (combinedValidationMessages.length === 0) {
    const oldValue = row[key]
    const artWasChanged = table === 'ap' && key === 'id'
    row[key] = value
    const newActiveNodeArray = clone(toJS(tree.activeNodeArray))
    /**
     * wert can contain characters such as /, &, %, ;
     * this causes problems when passed as param
     * so pass it as payload
     * put keep url/route signature in the time being
     * because of old application
     */
    const url = `/${table}?${idField}=eq.${tabelleId}`
    try {
      await axios.patch(url, { [key]: value })
    } catch (error) {
      // revert change in store
      row[key] = oldValue
      store.listError(error)
    }
    // if ApArtId of ap is updated, url needs to change
    if (artWasChanged) {
      newActiveNodeArray[3] = value
      tree.setActiveNodeArray(newActiveNodeArray)
    }
    // if beobNichtBeurteilt is set to beobNichtZuordnen, url needs to change
    if (table === 'beob' && key === 'nicht_zuordnen') {
      newActiveNodeArray[4] = value
        ? 'nicht-zuzuordnende-Beobachtungen'
        : 'nicht-beurteilte-Beobachtungen'
      newActiveNodeArray[5] = tree.activeDataset.row.id
      tree.setActiveNodeArray(newActiveNodeArray.slice(0, 6))
    }
    // if for a beobZugeordnet tpop_id is set, url needs to change
    // namely: pop_id and tpop_id
    if (table === 'beob' && key === 'tpop_id' && value) {
      const tpop = store.table.tpop.get(value)
      newActiveNodeArray[5] = tpop.pop_id
      newActiveNodeArray[7] = value
      tree.setActiveNodeArray(newActiveNodeArray)
    }
  }
}
