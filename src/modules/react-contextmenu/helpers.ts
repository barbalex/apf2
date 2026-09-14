// vendored from the abandoned react-contextmenu library,
// de-transpiled from its Babel output and typed

export function callIfExists<TArgs extends unknown[]>(
  func: ((...args: TArgs) => unknown) | null | undefined,
  ...args: TArgs
): unknown {
  return typeof func === 'function' && func.apply(undefined, args)
}

export function hasOwnProp(obj: object, prop: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export function uniqueId(): string {
  return Math.random().toString(36).substring(7)
}

export const cssClasses = {
  menu: 'react-contextmenu',
  menuVisible: 'react-contextmenu--visible',
  menuWrapper: 'react-contextmenu-wrapper',
  menuItem: 'react-contextmenu-item',
  menuItemActive: 'react-contextmenu-item--active',
  menuItemDisabled: 'react-contextmenu-item--disabled',
  menuItemDivider: 'react-contextmenu-item--divider',
  menuItemSelected: 'react-contextmenu-item--selected',
  subMenu: 'react-contextmenu-submenu',
}

export interface MenuStore {
  data?: Record<string, unknown>
  target?: EventTarget | null
}

export const store: MenuStore = {}

export const canUseDOM = Boolean(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement,
)
