// @flow
import { extendObservable } from 'mobx'
import $ from 'jquery'

export default (store:Object) => {
  extendObservable(store.ui, {
    windowWidth: $(window).width(),
    windowHeight: $(window).height(),
    treeHeight: 0,
    lastClickY: 0,
    treeTopPosition: 0,
  })
}
