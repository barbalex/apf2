import { runInAction } from 'mobx'

export default ({ store, data, table, field }) => {
  runInAction(() => {
    data.forEach(d =>
      store.table[table].set(d[field], d)
    )
  })
}
