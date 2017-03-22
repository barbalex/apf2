// @flow
import axios from 'axios'
import queryString from 'query-string'

import apiBaseUrl from './apiBaseUrl'
import tables from './tables'
import insertDatasetInIdb from './insertDatasetInIdb'

export default (store:Object, tablePassed:string, parentId:number, baseUrl:Array<string>) => {
  let table = tablePassed
  if (!table) {
    return store.listError(
      new Error(`no table passed`)
    )
  }
  // insert new dataset in db and fetch id
  const tableMetadata = tables.find(t => t.table === table)
  if (!tableMetadata) {
    return store.listError(
      new Error(`no table meta data found for table "${table}"`)
    )
  }
  // some tables need to be translated, i.e. tpopfreiwkontr
  if (tableMetadata.dbTable) {
    table = tableMetadata.dbTable
  }
  const parentIdField = tableMetadata.parentIdField
  const idField = tableMetadata.idField
  if (!idField) {
    return store.listError(
      new Error(`new dataset not created as no idField could be found`)
    )
  }
  const url = `${apiBaseUrl}/apflora/${table}/${parentIdField}/${parentId}`
  axios.post(url)
    .then((result) => {
      const row = result.data
      // insert this dataset in store.table
      store.table[table].set(row[idField], row)
      // insert this dataset in idb
      insertDatasetInIdb(store, table, row)
      // set new url
      baseUrl.push(row[idField])
      const query = `${Object.keys(store.urlQuery).length > 0 ? `?${queryString.stringify(store.urlQuery)}` : ``}`
      const newUrl = `/${baseUrl.join(`/`)}${query}`
      store.history.push(newUrl)
      // if zieljahr, need to update ZielJahr
      if (store.activeUrlElements.zieljahr) {
        store.updateProperty(`ZielJahr`, store.activeUrlElements.zieljahr)
        store.updatePropertyInDb(`ZielJahr`, store.activeUrlElements.zieljahr)
      }
      // if tpopfreiwkontr need to update TPopKontrTyp
      if (tablePassed === `tpopfreiwkontr`) {
        store.updateProperty(`TPopKontrTyp`, `Freiwilligen-Erfolgskontrolle`)
        store.updatePropertyInDb(`TPopKontrTyp`, `Freiwilligen-Erfolgskontrolle`)
      }
    })
    .catch(error => store.listError(error))
}
