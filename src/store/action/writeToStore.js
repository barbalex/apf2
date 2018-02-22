// @flow
import { runInAction } from 'mobx'

export default ({
  store,
  data,
  table,
  field,
}: {
  store: Object,
  data: Array<Object>,
  table: string,
  field: string,
}): void => {
  if (!!table && !!field) {
    runInAction(() => {
      data.forEach(d => store.table[table].set(d[field], d))
    })
  }
}
