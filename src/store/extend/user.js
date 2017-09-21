// @flow
import { extendObservable } from 'mobx'

export default (store: Object): void => {
  // name set to prevent Login Dialog from appearing before setLoginFromIdb has fetched from idb
  extendObservable(store.user, {
    name: 'temporaryValue',
    role: null,
    // TODO Authorization:
    // make this computed, depending on role
    readOnly: true,
    // TODO: add freiwillig, computed from role
    // TODO: add jwt
  })
}
