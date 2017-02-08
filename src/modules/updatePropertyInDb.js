// @flow
import axios from 'axios'
import queryString from 'query-string'
import objectValues from 'lodash/values'
import clone from 'lodash/clone'

import apiBaseUrl from './apiBaseUrl'
import tables from './tables'
import updatePropertyInIdb from './updatePropertyInIdb'
import deleteDatasetInIdb from './deleteDatasetInIdb'
import insertDatasetInIdb from './insertDatasetInIdb'

export default (store:Object, key:string, valuePassed:string|number) => {
  const { row, valid } = store.activeDataset
  let value = valuePassed
  let table = store.activeDataset.table

  // ensure primary data exists
  if (!key || !table || !row) {
    return
  }

  // ensure numbers saved as numbers
  if (value && !isNaN(value)) {
    value = +value
  }

  // convert undefined to null
  if (value === undefined) {
    value = null
  }

  // ensure derived data exists
  const tabelle = tables.find(t =>
    t.table === table
  )
  // in tpopfeldkontr and tpopfreiwkontr need to find dbTable
  if (tabelle.dbTable) {
    table = tabelle.dbTable
  }
  const idField = tabelle ? tabelle.idField : undefined
  if (!idField) {
    return store.listError(
      new Error(
        // $FlowIssue
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
        // $FlowIssue
        `change was not saved:
        field: ${key}, table: ${table}, value: ${value}
        Reason: tabelleId was not found`
      )
    )
  }

  // some fields contain 1 for true, 0 for false
  // not necessary: done by RadioButton component
  /*
  const booleanFields = [`TPopKontrJungPflJN`, `TPopKontrPlan`]
  if (booleanFields.includes(key)) {
    value = value === 1
  }*/

  // update if no validation messages exist
  const combinedValidationMessages = objectValues(valid).join(``)
  if (combinedValidationMessages.length === 0) {
    const { user } = store.user.name
    const oldValue = row[key]
    const artWasChanged = table === `ap` && key === `ApArtId`
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
      const newUrl = store.url
      newUrl.pop()
      newUrl.push(value)
      store.history.push(newUrl)
      deleteDatasetInIdb(store, `ap`, oldValue)
      insertDatasetInIdb(store, `ap`, rowCloned)
    } else {
      // need to set row[key] for select fields, checkboxes, radios...
      row[key] = value
    }
    // $FlowIssue
    const url = `${apiBaseUrl}/update/apflora/tabelle=${table}/tabelleIdFeld=${idField}/tabelleId=${tabelleId}/feld=${key}/wert=${value}/user=${user}`
    axios.put(url)
      .then(() => {
        // update in idb
        if (!artWasChanged) {
          updatePropertyInIdb(store, table, tabelleId, key, value)
        }
        // if ApArtId of ap is updated, url needs to change
        if (artWasChanged) {
          store.url[3] = value
          const newUrl = `/${store.url.join(`/`)}${Object.keys(store.urlQuery).length > 0 ? `?${queryString.stringify(store.urlQuery)}` : ``}`
          store.history.push(newUrl)
        }
        // if beobNichtBeurteilt is set to beobNichtZuordnen, url needs to change
        if (table === `beobzuordnung` && key === `BeobNichtZuordnen`) {
          store.url[4] = (
            value === 1 ?
            `nicht-zuzuordnende-Beobachtungen` :
            `nicht-beurteilte-Beobachtungen`
          )
          const newUrl = `/${store.url.join(`/`)}${Object.keys(store.urlQuery).length > 0 ? `?${queryString.stringify(store.urlQuery)}` : ``}`
          store.history.push(newUrl)
        }
        // if for a beobZugeordnet TPopId is set, url needs to change
        // namely: PopId and TPopId
        if (table === `beobzuordnung` && key === `TPopId` && value) {
          const tpop = store.table.tpop.get(value)
          store.url[5] = tpop.PopId
          store.url[7] = value
          const newUrl = `/${store.url.join(`/`)}${Object.keys(store.urlQuery).length > 0 ? `?${queryString.stringify(store.urlQuery)}` : ``}`
          store.history.push(newUrl)
        }
      })
      .catch((error) => {
        // revert change in store
        row[key] = oldValue
        store.listError(error)
      })
  }
}
