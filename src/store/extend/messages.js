// @flow
import { extendObservable, action } from 'mobx'

import fetchMessages from '../action/fetchMessages'
import setMessageRead from '../action/setMessageRead'

export default (store: Object): void => {
  extendObservable(store.messages, {
    fetch: action('fetchMessages', () => fetchMessages(store)),
    fetched: false,
    setFetched: action(
      'setMessagesFetched',
      () => (store.messages.fetched = true)
    ),
    setRead: action('setMessageRead', message =>
      setMessageRead(store, message)
    ),
    messages: [],
  })
}
