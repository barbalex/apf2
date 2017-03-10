// @flow
import axios from 'axios'
import queryString from 'query-string'

import apiBaseUrl from './apiBaseUrl'
import appBaseUrl from './appBaseUrl'
import insertDatasetInIdb from './insertDatasetInIdb'

const updateBeobzuordnungData = (store, beobBereitgestellt, newKey, newValue) => {
  store.updateProperty(newKey, newValue)
  store.updatePropertyInDb(newKey, newValue)
  store.updateProperty(`NO_ISFS`, beobBereitgestellt.NO_ISFS)
  store.updatePropertyInDb(`NO_ISFS`, beobBereitgestellt.NO_ISFS)
  store.updateProperty(`QuelleId`, beobBereitgestellt.QuelleId)
  store.updatePropertyInDb(`QuelleId`, beobBereitgestellt.QuelleId)
}

export default (store:Object, newKey:string, newValue:number) => {
  /**
   * newKey is either BeobNichtZuordnen or TPopId
   */
  // get data from beob_bereitgestellt in activeDataset
  const beobBereitgestellt = store.activeDataset.row
  // insert new dataset in db and fetch id
  const url = `${apiBaseUrl}/apflora/beobzuordnung/NO_NOTE/${beobBereitgestellt.BeobId}`
  axios.post(url)
    .then((result) => {
      const { projekt, ap } = store.activeUrlElements
      const row = result.data
      // insert this dataset in store.table
      store.table.beobzuordnung.set(row.NO_NOTE, row)
      // insert this dataset in idb
      insertDatasetInIdb(store, `beobzuordnung`, row)
      // set new url
      const query = `${Object.keys(store.urlQuery).length > 0 ? `?${queryString.stringify(store.urlQuery)}` : ``}`
      if (newKey === `BeobNichtZuordnen`) {
        const newUrl = `${appBaseUrl}/Projekte/${projekt}/Arten/${ap}/nicht-zuzuordnende-Beobachtungen/${beobBereitgestellt.BeobId}${query}`
        store.history.push(newUrl)
        updateBeobzuordnungData(store, beobBereitgestellt, newKey, newValue)
      } else if (newKey === `TPopId`) {
        // ouch. Need to get url to this tpop
        // fetch tpop to get needed data to build new url
        const url = `${apiBaseUrl}/apflora/tpop/TPopId/${newValue}`
        axios.post(url)
          .then(({ data }) => {
            const newUrl = `${appBaseUrl}/Projekte/${projekt}/Arten/${ap}/Populationen/${data.PopId}/Teil-Populationen/${newValue}/Beobachtungen/${beobBereitgestellt.BeobId}${query}`
            store.history.push(newUrl)
            updateBeobzuordnungData(store, beobBereitgestellt, newKey, newValue)
          })
          .catch(error => store.listError(error))
      }
    })
    .catch(error => store.listError(error))
}
