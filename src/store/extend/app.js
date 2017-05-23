// @flow
import { extendObservable, action } from 'mobx'
import fetchKtZh from '../action/fetchKtZh'

export default (store: Object): void => {
  extendObservable(store.app, {
    errors: [],
    fields: [],
    fetchKtZh: action('fetchKtZh', () => fetchKtZh(store)),
  })
}
