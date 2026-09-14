import assign from 'object-assign'

import { store } from './helpers.ts'

export var MENU_SHOW = 'REACT_CONTEXTMENU_SHOW'
export var MENU_HIDE = 'REACT_CONTEXTMENU_HIDE'

export function dispatchGlobalEvent(eventName, opts) {
  const target =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window

  // compatible with IE
  // @see http://stackoverflow.com/questions/26596123/internet-explorer-9-10-11-event-constructor-doesnt-work
  let event = void 0

  if (typeof window.CustomEvent === 'function') {
    event = new window.CustomEvent(eventName, { detail: opts })
  } else {
    event = document.createEvent('CustomEvent')
    event.initCustomEvent(eventName, false, true, opts)
  }

  if (target) {
    target.dispatchEvent(event)
    assign(store, opts)
  }
}

export function showMenu() {
  const opts =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
  const target = arguments[1]

  dispatchGlobalEvent(MENU_SHOW, assign({}, opts, { type: MENU_SHOW }), target)
}

export function hideMenu() {
  const opts =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
  const target = arguments[1]

  dispatchGlobalEvent(MENU_HIDE, assign({}, opts, { type: MENU_HIDE }), target)
}
