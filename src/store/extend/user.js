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
    token: null,
  })
}
