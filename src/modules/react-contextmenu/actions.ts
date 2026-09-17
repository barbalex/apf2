import { store } from './helpers.ts'

export const MENU_SHOW = 'REACT_CONTEXTMENU_SHOW'
export const MENU_HIDE = 'REACT_CONTEXTMENU_HIDE'

export interface MenuConfig {
  position?: { x: number; y: number }
  target?: EventTarget | null
  id?: string
  type?: string
  data?: Record<string, unknown>
}

export function dispatchGlobalEvent(
  eventName: string,
  opts: MenuConfig,
  target: EventTarget = window,
): void {
  // compatible with IE
  // @see http://stackoverflow.com/questions/26596123/internet-explorer-9-10-11-event-constructor-doesnt-work
  let event: CustomEvent<unknown>

  if (typeof window.CustomEvent === 'function') {
    event = new window.CustomEvent(eventName, { detail: opts })
  } else {
    event = document.createEvent('CustomEvent')
    event.initCustomEvent(eventName, false, true, opts)
  }

  if (target) {
    target.dispatchEvent(event)
    Object.assign(store, opts)
  }
}

export function showMenu(opts: MenuConfig = {}, target?: EventTarget): void {
  dispatchGlobalEvent(MENU_SHOW, { ...opts, type: MENU_SHOW }, target)
}

export function hideMenu(opts: MenuConfig = {}, target?: EventTarget): void {
  dispatchGlobalEvent(MENU_HIDE, { ...opts, type: MENU_HIDE }, target)
}
