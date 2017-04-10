// @flow
import { extendObservable } from 'mobx'

export default (store: Object) => {
  // name set to prevent Login Dialog from appearing before setLoginFromIdb has fetched from idb
  extendObservable(store.user, {
    name: `temporaryValue`,
    roles: [],
    readOnly: true,
  })
}
