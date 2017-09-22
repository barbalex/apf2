// @flow
import { extendObservable, computed } from 'mobx'

export default (store: Object): void => {
  // name set to prevent Login Dialog from appearing before setLoginFromIdb has fetched from idb
  extendObservable(store.user, {
    name: 'temporaryValue',
    role: null,
    readOnly: computed(
      () => !store.user.role || store.user.role === 'apflora_reader',
      { name: 'readOnly' }
    ),
    // TODO: add freiwillig, computed from role
    // give token a temporary value to prevent login form from opening
    // before login has been fetched
    token: 'none',
  })
}
