// @flow
import { extendObservable } from 'mobx'

export default (store:Object) => {
  extendObservable(store.app, {
    errors: [],
    fields: [],
  })
}
