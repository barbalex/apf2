// @flow
import { runInAction, computed } from 'mobx'
import axios from 'axios'
import cloneDeep from 'lodash/cloneDeep'

import recordValuesForWhichTableDataWasFetched from '../../modules/recordValuesForWhichTableDataWasFetched'

const writeToStore = (store, data) => {
  runInAction(() => {
    data.forEach(beob => {
      beob.beobzuordnung = computed(() =>
        store.table.beobzuordnung.get(beob.id)
      )
      store.table.beob.set(beob.id, beob)
    })
  })
}

const onError = ({
  store,
  valuesForWhichTableDataWasFetched,
  apArtId,
  error,
}: {
  store: Object,
  valuesForWhichTableDataWasFetched: Object,
  apArtId: number,
  error: Object,
}) => {
  store.loading = store.loading.filter(el => el !== 'beob')
  // remove setting that prevents loading of this value
  valuesForWhichTableDataWasFetched.beob.ArtId = valuesForWhichTableDataWasFetched.beob.ArtId.filter(
    x => x !== apArtId
  )
  store.listError(error)
}

export default async (store: Object, apArtId: number): any => {
  // only fetch if not yet fetched
  const { valuesForWhichTableDataWasFetched } = store
  if (
    valuesForWhichTableDataWasFetched.beob &&
    valuesForWhichTableDataWasFetched.beob.ArtId &&
    valuesForWhichTableDataWasFetched.beob.ArtId.includes(apArtId)
  ) {
    return
  }

  recordValuesForWhichTableDataWasFetched({
    store,
    table: 'beob',
    field: 'ArtId',
    value: apArtId,
  })

  let beobArtResult: { data: Array<Object> }
  try {
    beobArtResult = await axios.get(`beob_art?ApArtId=eq.${apArtId}`)
  } catch (error) {
    return onError({
      store,
      valuesForWhichTableDataWasFetched,
      apArtId,
      error,
    })
  }
  const taxonomyIds = beobArtResult.data.map(d => d.TaxonomieId)

  let beobResult: { data: Array<Object> }
  try {
    beobResult = await axios.get(`beob?ArtId=in.${taxonomyIds.join()}`)
  } catch (error) {
    return onError({
      store,
      valuesForWhichTableDataWasFetched,
      apArtId,
      error,
    })
  }
  // copy array without the individual objects being references
  // otherwise the computed values are passed to idb
  // and this creates errors, as they can't be cloned
  writeToStore(store, cloneDeep(beobResult.data))
}
