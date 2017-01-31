// @flow
import { runInAction } from 'mobx'

// tried to add computed values in initiateRow
// turned off because map value became unobservable
// import initiateRow from '../store/initiateRow'

export default ({
  store,
  data,
  table,
  field,
}:{
  store:Object,
  data:Array<Object>,
  table:string,
  field:string,
}) => {
  runInAction(() => {
    data.forEach(d =>
      store.table[table].set(d[field], d)
    )
  })
}
