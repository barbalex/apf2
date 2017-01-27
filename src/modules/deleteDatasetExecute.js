import axios from 'axios'
import queryString from 'query-string'

import apiBaseUrl from './apiBaseUrl'
import tables from './tables'
import deleteDatasetInIdb from './deleteDatasetInIdb'

export default (store) => {
  // deleteDatasetDemand checks variables
  const { table: tablePassed, id, idField, url } = store.datasetToDelete
  let table = tablePassed
  const tableMetadata = tables.find(t => t.table === table)
  if (!tableMetadata) {
    return store.listError(
      new Error(`Error in action deleteDatasetDemand: no table meta data found for table "${table}"`)
    )
  }
  // some tables need to be translated, i.e. tpopfreiwkontr
  if (tableMetadata.dbTable) {
    table = tableMetadata.dbTable
  }
  const deleteUrl = `${apiBaseUrl}/apflora/tabelle=${table}/tabelleIdFeld=${idField}/tabelleId=${id}`
  axios.delete(deleteUrl)
    .then(() => {
      // remove this dataset in store.table
      store.table[table].delete(id)
      // remove from idb
      deleteDatasetInIdb(store, table, id)
      // set new url
      url.pop()
      store.history.push(`/${url.join(`/`)}${Object.keys(store.urlQuery).length > 0 ? `?${queryString.stringify(store.urlQuery)}` : ``}`)
      store.datasetToDelete = {}
      // if zieljahr is active, need to pop again, if there is no other ziel left in same year
      if (store.activeUrlElements.zieljahr && !store.activeUrlElements.zielber) {
        // see if there are ziele left with this zieljahr
        const zieleWithActiveZieljahr = Array.from(store.table.ziel.values())
          .filter(ziel =>
            ziel.ApArtId === store.activeUrlElements.ap && ziel.ZielJahr === store.activeUrlElements.zieljahr
          )
        if (zieleWithActiveZieljahr.length === 0) {
          url.pop()
          store.history.push(`/${url.join(`/`)}${Object.keys(store.urlQuery).length > 0 ? `?${queryString.stringify(store.urlQuery)}` : ``}`)
        }
      }
    })
    .catch((error) => {
      store.listError(error)
      store.datasetToDelete = {}
    })
}
