// @flow
import { runInAction, computed } from 'mobx'
import axios from 'axios'
import cloneDeep from 'lodash/cloneDeep'

import recordValuesForWhichTableDataWasFetched from '../../modules/recordValuesForWhichTableDataWasFetched'

const writeToStore = (store, data) => {
  runInAction(() => {
    data.forEach(beob => {
      beob.tpopbeob = computed(() => store.table.tpopbeob.get(beob.id))
      store.table.beob.set(beob.id, beob)
    })
  })
}

const onError = ({
  store,
  valuesForWhichTableDataWasFetched,
  apId,
  error,
}: {
  store: Object,
  valuesForWhichTableDataWasFetched: Object,
  apId: number,
  error: Object,
}) => {
  store.loading = store.loading.filter(el => el !== 'beob')
  // remove setting that prevents loading of this value
  valuesForWhichTableDataWasFetched.beob.art_id = valuesForWhichTableDataWasFetched.beob.art_id.filter(
    x => x !== apId
  )
  store.listError(error)
}

export default async (store: Object, apId: number): any => {
  const { valuesForWhichTableDataWasFetched } = store
  let apArtResult: { data: Array<Object> }
  try {
    apArtResult = await axios.get(`apart?ap_id=eq.${apId}`)
  } catch (error) {
    return onError({
      store,
      valuesForWhichTableDataWasFetched,
      apId,
      error,
    })
  }
  const artIds = apArtResult.data
    .map(d => d.id)
    // if exists new apart but art is not choosen, its value is null
    // need to filter that out
    .filter(v => !!v)

  // only fetch if not yet fetched
  if (
    valuesForWhichTableDataWasFetched.beob &&
    valuesForWhichTableDataWasFetched.beob.art_id &&
    valuesForWhichTableDataWasFetched.beob.art_id.includes(artIds.join())
  ) {
    return
  }

  recordValuesForWhichTableDataWasFetched({
    store,
    table: 'beob',
    field: 'art_id',
    value: artIds.join(),
  })

  let beobResult: { data: Array<Object> }
  try {
    beobResult = await axios.get(`beob?art_id=in.${artIds.join()}`)
  } catch (error) {
    return onError({
      store,
      valuesForWhichTableDataWasFetched,
      apId,
      error,
    })
  }
  // copy array without the individual objects being references
  // otherwise the computed values are passed to idb
  // and this creates errors, as they can't be cloned
  writeToStore(store, cloneDeep(beobResult.data))
}
