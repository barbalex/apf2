// @flow
import { extendObservable } from 'mobx'

export default (store: Object): void => {
  extendObservable(store.app, {
    errors: [],
    fields: [],
  })
}
