import { runInAction, computed } from 'mobx'
import axios from 'axios'
import app from 'ampersand-app'

import apiBaseUrl from './apiBaseUrl'
import recordValuesForWhichTableDataWasFetched from './recordValuesForWhichTableDataWasFetched'

const writeToStore = (store, data) => {
  runInAction(() => {
    data.forEach((zuordnung) => {
      // set computed value "beob_bereitgestellt"
      zuordnung.beobBereitgestellt = computed(() =>
        store.table.beob_bereitgestellt.get(zuordnung.NO_NOTE)
      )
      // set computed value "type"
      zuordnung.type = computed(() => {
        if (zuordnung.BeobNichtZuordnen && zuordnung.BeobNichtZuordnen === 1) {
          return `nichtZuzuordnen`
        }
        if (zuordnung.TPopId) {
          return `zugeordnet`
        }
        return `nichtBeurteilt`
      })
      store.table.beobzuordnung.set(zuordnung.NO_NOTE, zuordnung)
    })
  })
}

export default (store, apArtId) => {
  // console.log(`module fetchBeobzuordnung: apArtId:`, apArtId)
  const { valuesForWhichTableDataWasFetched } = store
  if (!apArtId) {
    return new Error(`action fetchBeobzuordnung: apArtId must be passed`)
  }

  // only fetch if not yet fetched
  if (
    valuesForWhichTableDataWasFetched.beobzuordnung &&
    valuesForWhichTableDataWasFetched.beobzuordnung.NO_ISFS &&
    valuesForWhichTableDataWasFetched.beobzuordnung.NO_ISFS.includes(apArtId)
  ) {
    return
  }

  const url = `${apiBaseUrl}/beobzuordnung/${apArtId}`
  store.table.beobzuordnungLoading = true
  app.db.beobzuordnung
    .toArray()
    .then((data) => {
      writeToStore(store, data)
      store.table.beobzuordnungLoading = false
      recordValuesForWhichTableDataWasFetched({ store, table: `beobzuordnung`, field: `NO_ISFS`, value: apArtId })
    })
    .then(() => axios.get(url))
    .then(({ data }) => {
      // leave ui react before this happens
      setTimeout(() => writeToStore(store, data))
      setTimeout(() => app.db.beobzuordnung.bulkPut(data))
    })
    .catch(error => new Error(`error fetching table beobzuordnung:`, error))
}
