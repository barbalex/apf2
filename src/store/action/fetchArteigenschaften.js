// @flow
import axios from 'axios'

export default async (store: Object): Promise<any> => {
  store.loading.push('adb_eigenschaften')
  let url = `/schema/beob/table/adb_eigenschaften`

  let data
  try {
    const dataFromDbObject = await axios.get(url)
    data = dataFromDbObject.data
  } catch (error) {
    store.listError(error)
  }
  if (data && data.length) {
    // leave ui react before this happens
    setTimeout(() =>
      store.writeToStore({
        data,
        table: 'adb_eigenschaften',
        field: 'TaxonomieId',
      })
    )
  }
  store.loading = store.loading.filter(el => el !== 'adb_eigenschaften')
}
