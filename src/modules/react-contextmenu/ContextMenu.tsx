import React from 'react'
import cx from 'classnames'

import listener, { type MenuEvent } from './globalEventListener.ts'
import AbstractMenu, {
  type AbstractMenuProps,
  type AbstractMenuState,
} from './AbstractMenu.tsx'
import SubMenu from './SubMenu.tsx'
import { hideMenu, type MenuConfig } from './actions.ts'
import { cssClasses, callIfExists, store } from './helpers.ts'

export interface ContextMenuProps extends AbstractMenuProps {
  id: string
  className?: string
  data?: Record<string, unknown>
  hideOnLeave?: boolean
  onMouseLeave?: (
    event: React.MouseEvent<HTMLElement>,
    data: Record<string, unknown>,
    target: EventTarget | null | undefined,
  ) => void
  onShow?: (event: MenuEvent) => void
  onHide?: (event: MenuEvent | React.SyntheticEvent) => void
  style?: React.CSSProperties
  rtl?: boolean
  preventHideOnLeave?: boolean
  preventHideOnScroll?: boolean
  preventHideOnContextMenu?: boolean
  preventHideOnResize?: boolean
}

interface ContextMenuState extends AbstractMenuState {
  x: number
  y: number
  isVisible: boolean
}

class ContextMenu extends AbstractMenu<ContextMenuProps, ContextMenuState> {
  listenId: string | undefined
  menu: HTMLElement | null = null
  state: ContextMenuState = {
    selectedItem: null,
    forceSubMenuOpen: false,
    x: 0,
    y: 0,
    isVisible: false,
  }

  getSubMenuType() {
    return SubMenu
  }

  registerHandlers = () => {
    document.addEventListener('mousedown', this.handleOutsideClick as EventListener)
    document.addEventListener('touchstart', this.handleOutsideClick as EventListener)
    if (!this.props.preventHideOnScroll)
      document.addEventListener('scroll', this.handleHide as EventListener)
    if (!this.props.preventHideOnContextMenu)
      document.addEventListener('contextmenu', this.handleHide as EventListener)
    document.addEventListener('keydown', this.handleKeyNavigation as unknown as EventListener)
    if (!this.props.preventHideOnResize)
      window.addEventListener('resize', this.handleHide as EventListener)
  }

  unregisterHandlers = () => {
    document.removeEventListener('mousedown', this.handleOutsideClick as EventListener)
    document.removeEventListener('touchstart', this.handleOutsideClick as EventListener)
    document.removeEventListener('scroll', this.handleHide as EventListener)
    document.removeEventListener('contextmenu', this.handleHide as EventListener)
    document.removeEventListener('keydown', this.handleKeyNavigation as unknown as EventListener)
    window.removeEventListener('resize', this.handleHide as EventListener)
  }

  handleShow = (e: MenuEvent) => {
    if (e.detail.id !== this.props.id || this.state.isVisible) return

    const x = e.detail.position?.x
    const y = e.detail.position?.y

    this.setState({ isVisible: true, x: x ?? 0, y: y ?? 0 })
    this.registerHandlers()
    callIfExists(this.props.onShow, e)
  }

  // also called directly with React events, which have no detail
  handleHide = (e: MenuEvent | React.SyntheticEvent) => {
    const detail = (e as MenuEvent).detail as MenuConfig | undefined
    if (
      this.state.isVisible &&
      (!detail || !detail.id || detail.id === this.props.id)
    ) {
      this.unregisterHandlers()
      this.setState({
        isVisible: false,
        selectedItem: null,
        forceSubMenuOpen: false,
      })
      callIfExists(this.props.onHide, e as MenuEvent)
    }
  }

  handleOutsideClick = (e: MouseEvent) => {
    if (!this.menu?.contains(e.target as Node)) hideMenu()
  }

  handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()

    callIfExists(
      this.props.onMouseLeave,
      event,
      Object.assign({}, this.props.data ?? {}, store.data),
      store.target,
    )

    if (this.props.hideOnLeave) hideMenu()
  }

  handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    if (process.env.NODE_ENV === 'production') {
      e.preventDefault()
    }
    this.handleHide(e)
  }

  hideMenu = (e: React.KeyboardEvent) => {
    if (e.keyCode === 27 || e.keyCode === 13) {
      // ESC or enter
      hideMenu()
    }
  }

  getMenuPosition(x = 0, y = 0): { top: number; left: number } {
    const menuStyles = {
      top: y,
      left: x,
    }

    if (!this.menu) return menuStyles

    const { innerWidth, innerHeight } = window
    const rect = this.menu.getBoundingClientRect()

    if (y + rect.height > innerHeight) {
      menuStyles.top -= rect.height
    }

    if (x + rect.width > innerWidth) {
      menuStyles.left -= rect.width
    }

    if (menuStyles.top < 0) {
      menuStyles.top =
        rect.height < innerHeight ? (innerHeight - rect.height) / 2 : 0
    }

    if (menuStyles.left < 0) {
      menuStyles.left =
        rect.width < innerWidth ? (innerWidth - rect.width) / 2 : 0
    }

    return menuStyles
  }

  getRTLMenuPosition(x = 0, y = 0): { top: number; left: number } {
    const menuStyles = {
      top: y,
      left: x,
    }

    if (!this.menu) return menuStyles

    const { innerWidth, innerHeight } = window
    const rect = this.menu.getBoundingClientRect()

    // Try to position the menu on the left side of the cursor
    menuStyles.left = x - rect.width

    if (y + rect.height > innerHeight) {
      menuStyles.top -= rect.height
    }

    if (menuStyles.left < 0) {
      menuStyles.left += rect.width
    }

    if (menuStyles.top < 0) {
      menuStyles.top =
        rect.height < innerHeight ? (innerHeight - rect.height) / 2 : 0
    }

    if (menuStyles.left + rect.width > innerWidth) {
      menuStyles.left =
        rect.width < innerWidth ? (innerWidth - rect.width) / 2 : 0
    }

    return menuStyles
  }

  menuRef = (c: HTMLElement | null) => {
    this.menu = c
  }

  componentDidMount() {
    this.listenId = listener.register(this.handleShow, this.handleHide)
  }

  componentDidUpdate() {
    const wrapper = window.requestAnimationFrame || (setTimeout as typeof requestAnimationFrame)
    if (this.state.isVisible) {
      wrapper(() => {
        const { x, y } = this.state

        const { top, left } = this.props.rtl ?
            this.getRTLMenuPosition(x, y)
          : this.getMenuPosition(x, y)

        wrapper(() => {
          if (!this.menu) return
          this.menu.style.top = top + 'px'
          this.menu.style.left = left + 'px'
          this.menu.style.opacity = '1'
          this.menu.style.pointerEvents = 'auto'
        })
      })
    } else {
      wrapper(() => {
        if (!this.menu) return
        this.menu.style.opacity = '0'
        this.menu.style.pointerEvents = 'none'
      })
    }
  }

  componentWillUnmount() {
    if (this.listenId) {
      listener.unregister(this.listenId)
    }

    this.unregisterHandlers()
  }

  render() {
    const { children, className = '', style = {} } = this.props
    const isVisible = this.state.isVisible

    const inlineStyle: React.CSSProperties = {
      ...style,
      position: 'fixed',
      opacity: 0,
      pointerEvents: 'none',
    }
    const menuClassnames = cx(cssClasses.menu, className, {
      [cssClasses.menuVisible]: isVisible,
    })

    return (
      <nav
        role="menu"
        tabIndex={-1}
        ref={this.menuRef}
        style={inlineStyle}
        className={menuClassnames}
        onContextMenu={this.handleContextMenu}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.renderChildren(children)}
      </nav>
    )
  }
}

export default ContextMenu
