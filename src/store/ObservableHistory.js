// @flow
/**
 * need to build a singleton from history
 * where the needed methods are returned
 * and location is made observable
 * reason: MobX starting at v2.7.0 does not accept making history itself observable any more
 * see: https://github.com/mobxjs/mobx/issues/710
 *
 * get ui to follow url changes when user clicks browser back and forwards buttons:
 * //stackoverflow.com/questions/25806608/how-to-detect-browser-back-button-event-cross-browser
 */

import { extendObservable } from 'mobx'
import createHistory from 'history/createBrowserHistory'

const history = createHistory()

const History = {
  mouseIsInDoc: true,
  history,
  action: history.action,
  push: history.push,
  replace: history.replace,
  block: history.block,
  go: history.go,
  goBack: history.goBack,
  goForward: history.goForward,
  length: history.length,
  createHref: history.createHref,
}

extendObservable(History, {
  location: history.location,
})
history.listen((location) => {
  History.location = location
})
document.onmouseover = () => {
  History.mouseIsInDoc = true
}
document.onmouseleave = () => {
  History.mouseIsInDoc = false
}
window.onpopstate = () => {
  if (!History.mouseIsInDoc) {
    History.location.pathname = document.location.pathname
    History.location.search = document.location.search
  }
}

export default History
