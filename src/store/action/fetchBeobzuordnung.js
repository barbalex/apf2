// @flow
import { runInAction, computed } from 'mobx'
import axios from 'axios'
import app from 'ampersand-app'
import cloneDeep from 'lodash/cloneDeep'

import apiBaseUrl from '../../modules/apiBaseUrl'
import recordValuesForWhichTableDataWasFetched from '../../modules/recordValuesForWhichTableDataWasFetched'

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

export default (store: Object, apArtId: number) => {
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
  store.loading.push(`beobzuordnung`)
  app.db.beobzuordnung
    .toArray()
    .then((data) => {
      writeToStore(store, data)
      recordValuesForWhichTableDataWasFetched({ store, table: `beobzuordnung`, field: `NO_ISFS`, value: apArtId })
    })
    .then(() => axios.get(url))
    .then(({ data }) => {
      store.loading = store.loading.filter(el => el !== `beobzuordnung`)
      // leave ui react before this happens
      // copy array without the individual objects being references
      // otherwise the computed values are passed to idb
      // and this creates errors, ad they can't be cloned
      setTimeout(() => writeToStore(store, cloneDeep(data)))
      setTimeout(() => app.db.beobzuordnung.bulkPut(data))
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== `beobzuordnung`)
      store.listError(error)
    })
}
