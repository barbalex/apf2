// @flow
import axios from 'axios'
import objectValues from 'lodash/values'
import clone from 'lodash/clone'
import { toJS } from 'mobx'

import tables from '../../modules/tables'

export default async (
  store: Object,
  tree: Object,
  key: string,
  valuePassed: string | number
): any => {
  const { row, valid } = tree.activeDataset
  let value = valuePassed
  let table = tree.activeDataset.table

  // ensure primary data exists
  if (!key || !table || !row) {
    return
  }

  // ensure numbers saved as numbers
  if (value && !isNaN(value)) {
    value = +value
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
    const artWasChanged = table === 'ap' && key === 'ApArtId'
    if (artWasChanged) {
      // if this was ap, then the map key has changed!
      // need to delete map value and create new one
      // then set activeDataset to this value
      const rowCloned = clone(row)
      rowCloned[key] = value
      store.table.ap.delete(oldValue)
      store.table.ap.set(value, rowCloned)
      // correct url
      // activeDataset will then be updated
      const newActiveNodeArray = clone(toJS(tree.activeNodeArray))
      newActiveNodeArray.pop()
      newActiveNodeArray.push(value)
      tree.setActiveNodeArray(newActiveNodeArray)
    } else {
      // need to set row[key] for select fields, checkboxes, radios...
      // console.log('updatePropertyInDb: setting row[key] of store to:', value)
      row[key] = value
    }
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
    if (table === 'beobzuordnung' && key === 'BeobNichtZuordnen') {
      newActiveNodeArray[4] =
        value === 1
          ? 'nicht-zuzuordnende-Beobachtungen'
          : 'nicht-beurteilte-Beobachtungen'
      newActiveNodeArray[5] = tree.activeDataset.row.BeobId
      tree.setActiveNodeArray(newActiveNodeArray.slice(0, 6))
    }
    // if for a beobZugeordnet TPopId is set, url needs to change
    // namely: PopId and TPopId
    if (table === 'beobzuordnung' && key === 'TPopId' && value) {
      const tpop = store.table.tpop.get(value)
      newActiveNodeArray[5] = tpop.PopId
      newActiveNodeArray[7] = value
      tree.setActiveNodeArray(newActiveNodeArray)
    }
    if (table === 'beobart') {
      // refetch beob
      store.fetchBeob(tree.activeNodes.ap)
    }
  }
}
