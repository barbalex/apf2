// @flow
import { extendObservable, action } from 'mobx'

export default (store: Object): void => {
  extendObservable(store.qk, {
    messages: [],
    filter: '',
    setFilter: action('setFilter', filter => (store.qk.filter = filter)),
    setMessages: action(
      'setMessages',
      messages => (store.qk.messages = messages)
    ),
    addMessages: action(
      'addMessages',
      messages => (store.qk.messages = [...store.qk.messages, messages])
    ),
  })
}
