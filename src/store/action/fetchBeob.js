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
  valuesForWhichTableDataWasFetched.beob.ArtId = valuesForWhichTableDataWasFetched.beob.ArtId.filter(
    x => x !== apId
  )
  store.listError(error)
}

export default async (store: Object, apId: number): any => {
  const { valuesForWhichTableDataWasFetched } = store
  let beobArtResult: { data: Array<Object> }
  try {
    beobArtResult = await axios.get(`beobart?ap_id=eq.${apId}`)
  } catch (error) {
    return onError({
      store,
      valuesForWhichTableDataWasFetched,
      apId,
      error,
    })
  }
  const taxonomyIds = beobArtResult.data
    .map(d => d.taxid)
    // if exists new beobart but art is not choosen, its value is null
    // need to filter that out
    .filter(v => !!v)

  // only fetch if not yet fetched
  if (
    valuesForWhichTableDataWasFetched.beob &&
    valuesForWhichTableDataWasFetched.beob.ArtId &&
    valuesForWhichTableDataWasFetched.beob.ArtId.includes(taxonomyIds.join())
  ) {
    return
  }

  recordValuesForWhichTableDataWasFetched({
    store,
    table: 'beob',
    field: 'ArtId',
    value: taxonomyIds.join(),
  })

  let beobResult: { data: Array<Object> }
  try {
    beobResult = await axios.get(`beob?ArtId=in.${taxonomyIds.join()}`)
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
