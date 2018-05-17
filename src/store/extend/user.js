// @flow
import { extendObservable } from 'mobx'

export default (store: Object): void => {
  // name set to prevent Login Dialog from appearing before setLoginFromIdb has fetched from idb
  extendObservable(store.user, {
    name: 'temporaryValue',
    // TODO: add freiwillig, computed from role
    // give token a temporary value to prevent login form from opening
    // before login has been fetched
    token: 'none',
  })
}
