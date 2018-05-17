// @flow
// don't know why but combining this with extendStore call
// creates an error in an autorun
// maybe needed actions are not part of Store yet?
import { extendObservable, autorun } from 'mobx'

import manipulateUrl from '../action/manipulateUrl'

export default (store: Object): void => {
  extendObservable(store, {
    manipulateUrl: autorun(() => manipulateUrl(store)),
  })
}
