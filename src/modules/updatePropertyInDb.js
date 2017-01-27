
import axios from 'axios'
import queryString from 'query-string'
import objectValues from 'lodash/values'

import apiBaseUrl from './apiBaseUrl'
import tables from './tables'
import updatePropertyInIdb from './updatePropertyInIdb'

export default (store, key, valuePassed) => {
  const { row, valid } = store.activeDataset
  const tablePassed = store.activeDataset.table
  let value = valuePassed
  let table = tablePassed

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
        `change was not saved:
        field: ${key}, table: ${table}, value: ${value}
        Reason: idField was not found`
      )
    )
  }
  const tabelleId = row[idField] || undefined
  if (!tabelleId) {
    return store.listError(
      new Error(
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
    const { user } = store.app
    const oldValue = row[key]
    row[key] = value
    const url = `${apiBaseUrl}/update/apflora/tabelle=${table}/tabelleIdFeld=${idField}/tabelleId=${tabelleId}/feld=${key}/wert=${value}/user=${user}`
    axios.put(url)
      .then(() => {
        // update in idb
        updatePropertyInIdb(store, table, tabelleId, key, value)
        // if ApArtId of ap is updated, url needs to change
        if (table === `ap` && key === `ApArtId`) {
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
