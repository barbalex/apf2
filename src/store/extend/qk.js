// @flow
import { extendObservable, action } from 'mobx'

export default (store: Object): void => {
  extendObservable(store.qk, {
    messages: [],
    loading: false,
    setLoading: action('setLoading', loading => (store.qk.loading = loading)),
    filter: '',
    setFilter: action('setFilter', filter => (store.qk.filter = filter)),
    addMessages: action(
      'addMessages',
      messages => (store.qk.messages = [...store.qk.messages, messages])
    ),
  })
}
