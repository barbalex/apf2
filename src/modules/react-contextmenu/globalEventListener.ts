import { MENU_SHOW, MENU_HIDE, type MenuConfig } from './actions.ts'
import { uniqueId, hasOwnProp, canUseDOM } from './helpers.ts'

export type MenuEvent = CustomEvent<MenuConfig>

export interface MenuCallbacks {
  show: (event: MenuEvent) => void
  hide: (event: MenuEvent) => void
}

class GlobalEventListener {
  callbacks: Record<string, MenuCallbacks> = {}

  handleShowEvent = (event: MenuEvent) => {
    for (const id in this.callbacks) {
      if (hasOwnProp(this.callbacks, id)) this.callbacks[id]!.show(event)
    }
  }

  handleHideEvent = (event: MenuEvent) => {
    for (const id in this.callbacks) {
      if (hasOwnProp(this.callbacks, id)) this.callbacks[id]!.hide(event)
    }
  }

  register(showCallback: MenuCallbacks['show'], hideCallback: MenuCallbacks['hide']): string {
    const id = uniqueId()

    this.callbacks[id] = {
      show: showCallback,
      hide: hideCallback,
    }

    return id
  }

  unregister(id?: string): void {
    if (id && this.callbacks[id]) {
      delete this.callbacks[id]
    }
  }

  constructor() {
    if (canUseDOM) {
      window.addEventListener(MENU_SHOW, this.handleShowEvent as EventListener)
      window.addEventListener(MENU_HIDE, this.handleHideEvent as EventListener)
    }
  }
}

export default new GlobalEventListener()
