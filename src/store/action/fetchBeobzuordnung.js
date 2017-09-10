// @flow
import { runInAction, computed } from 'mobx'
import axios from 'axios'
import cloneDeep from 'lodash/cloneDeep'

import recordValuesForWhichTableDataWasFetched from '../../modules/recordValuesForWhichTableDataWasFetched'

const writeToStore = (store: Object, data: Array<Object>): void => {
  runInAction(() => {
    data.forEach(zuordnung => {
      // set computed value "beob"
      zuordnung.beob = computed(() => store.table.beob.get(zuordnung.BeobId))
      // set computed value "type"
      zuordnung.type = computed(() => {
        if (zuordnung.BeobNichtZuordnen && zuordnung.BeobNichtZuordnen === 1) {
          return 'nichtZuzuordnen'
        }
        if (zuordnung.TPopId) {
          return 'zugeordnet'
        }
        return 'nichtBeurteilt'
      })
      store.table.beobzuordnung.set(zuordnung.BeobId, zuordnung)
    })
  })
}

export default (store: Object, apArtId: number): any => {
  // console.log('module fetchBeobzuordnung: apArtId:', apArtId)
  const { valuesForWhichTableDataWasFetched } = store
  if (!apArtId) {
    return store.listError(
      new Error('action fetchBeobzuordnung: apArtId must be passed')
    )
  }

  // only fetch if not yet fetched
  if (
    valuesForWhichTableDataWasFetched.beobzuordnung &&
    valuesForWhichTableDataWasFetched.beobzuordnung.ArtId &&
    valuesForWhichTableDataWasFetched.beobzuordnung.ArtId.includes(apArtId)
  ) {
    return
  }

  const url = `/beobzuordnung/${apArtId}`
  store.loading.push('beobzuordnung')
  axios
    .get(url)
    .then(({ data }) => {
      store.loading = store.loading.filter(el => el !== 'beobzuordnung')
      // leave ui react before this happens
      // copy array without the individual objects being references
      // otherwise the computed values are passed to idb
      // and this creates errors, ad they can't be cloned
      setTimeout(() => {
        writeToStore(store, cloneDeep(data))
        recordValuesForWhichTableDataWasFetched({
          store,
          table: 'beobzuordnung',
          field: 'ArtId',
          value: apArtId,
        })
      })
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== 'beobzuordnung')
      store.listError(error)
    })
}
