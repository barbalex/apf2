import React from 'react'
import cx from 'classnames'

import { hideMenu } from './actions.ts'
import AbstractMenu, {
  type AbstractMenuProps,
  type AbstractMenuState,
} from './AbstractMenu.tsx'
import { cssClasses, callIfExists, hasOwnProp, store } from './helpers.ts'
import listener, { type MenuEvent } from './globalEventListener.ts'

export interface SubMenuAttributes extends React.HTMLAttributes<HTMLDivElement> {
  disabledClassName?: string
  dividerClassName?: string
  selectedClassName?: string
  visibleClassName?: string
  listClassName?: string
}

export interface SubMenuProps extends AbstractMenuProps {
  title: React.ReactNode
  attributes?: SubMenuAttributes
  className?: string
  disabled?: boolean
  data?: Record<string, unknown>
  onClick?: (
    event: React.MouseEvent<HTMLDivElement>,
    data: Record<string, unknown>,
    target: EventTarget | null | undefined,
  ) => void
  onMouseOut?: React.MouseEventHandler<HTMLDivElement>
  onMouseMove?: React.MouseEventHandler<HTMLDivElement>
  preventCloseOnClick?: boolean
  forceOpen?: boolean
  forceClose?: () => void
  parentKeyNavigationHandler?: ((e: React.KeyboardEvent) => void) | null
  hoverDelay?: number
  rtl?: boolean
  selected?: boolean
}

interface SubMenuState extends AbstractMenuState {
  visible: boolean
}

class SubMenu extends AbstractMenu<SubMenuProps, SubMenuState> {
  listenId: string | undefined
  menu: HTMLElement | null = null
  subMenu: HTMLElement | null = null
  state: SubMenuState = {
    selectedItem: null,
    forceSubMenuOpen: false,
    visible: false,
  }
  opentimer: ReturnType<typeof setTimeout> | undefined
  closetimer: ReturnType<typeof setTimeout> | undefined
  isVisibilityChange = false

  getMenuPosition(): Partial<
    Record<'top' | 'bottom' | 'left' | 'right', number | string>
  > {
    const { innerWidth, innerHeight } = window
    const position: Partial<
      Record<'top' | 'bottom' | 'left' | 'right', number | string>
    > = {}

    if (!this.subMenu) return position
    const rect = this.subMenu.getBoundingClientRect()

    if (rect.bottom > innerHeight) {
      position.bottom = 0
    } else {
      position.top = 0
    }

    if (rect.right < innerWidth) {
      position.left = '100%'
    } else {
      position.right = '100%'
    }

    return position
  }

  getRTLMenuPosition(): Partial<
    Record<'top' | 'bottom' | 'left' | 'right', number | string>
  > {
    const { innerHeight } = window
    const position: Partial<
      Record<'top' | 'bottom' | 'left' | 'right', number | string>
    > = {}

    if (!this.subMenu) return position
    const rect = this.subMenu.getBoundingClientRect()

    if (rect.bottom > innerHeight) {
      position.bottom = 0
    } else {
      position.top = 0
    }

    if (rect.left < 0) {
      position.left = '100%'
    } else {
      position.right = '100%'
    }

    return position
  }

  hideSubMenu = (e: MenuEvent) => {
    // avoid closing submenus of a different menu tree
    if (e.detail && e.detail.id && this.menu && e.detail.id !== this.menu.id) {
      return
    }

    if (this.props.forceOpen) {
      this.props.forceClose?.()
    }
    this.setState({ visible: false, selectedItem: null })
    this.unregisterHandlers()
  }

  handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()

    if (this.props.disabled) return

    callIfExists(
      this.props.onClick,
      event,
      Object.assign({}, this.props.data, store.data),
      store.target,
    )

    if (!this.props.onClick || this.props.preventCloseOnClick) return

    hideMenu()
  }

  handleMouseEnter = () => {
    if (this.opentimer) clearTimeout(this.opentimer)

    if (this.props.disabled || this.state.visible) return

    this.opentimer = setTimeout(() => {
      this.setState({
        visible: true,
        selectedItem: null,
      })
    }, this.props.hoverDelay ?? 500)
  }

  handleMouseLeave = () => {
    if (this.opentimer) clearTimeout(this.opentimer)

    if (!this.state.visible) return

    this.closetimer = setTimeout(() => {
      this.setState({
        visible: false,
        selectedItem: null,
      })
    }, this.props.hoverDelay ?? 500)
  }

  menuRef = (c: HTMLElement | null) => {
    this.menu = c
  }

  subMenuRef = (c: HTMLElement | null) => {
    this.subMenu = c
  }

  registerHandlers = () => {
    document.removeEventListener(
      'keydown',
      (this.props.parentKeyNavigationHandler ??
        (() => null)) as unknown as EventListener,
    )
    document.addEventListener(
      'keydown',
      this.handleKeyNavigation as unknown as EventListener,
    )
  }

  unregisterHandlers = (dismounting?: boolean) => {
    document.removeEventListener(
      'keydown',
      this.handleKeyNavigation as unknown as EventListener,
    )
    if (!dismounting) {
      document.addEventListener(
        'keydown',
        (this.props.parentKeyNavigationHandler ??
          (() => null)) as unknown as EventListener,
      )
    }
  }

  componentDidMount() {
    this.listenId = listener.register(() => {}, this.hideSubMenu)
  }

  getSubMenuType() {
    return SubMenu
  }

  shouldComponentUpdate(
    nextProps: Readonly<SubMenuProps>,
    nextState: Readonly<SubMenuState>,
  ) {
    this.isVisibilityChange =
      (this.state.visible !== nextState.visible ||
        (this.props.forceOpen ?? false) !== nextProps.forceOpen) &&
      !(this.state.visible && nextProps.forceOpen) &&
      !((this.props.forceOpen ?? false) && nextState.visible)
    return true
  }

  componentDidUpdate() {
    if (!this.isVisibilityChange) return
    if ((this.props.forceOpen ?? false) || this.state.visible) {
      const wrapper =
        window.requestAnimationFrame ||
        (setTimeout as typeof requestAnimationFrame)
      wrapper(() => {
        const styles =
          this.props.rtl ? this.getRTLMenuPosition() : this.getMenuPosition()
        const subMenu = this.subMenu
        if (!subMenu) return

        subMenu.style.removeProperty('top')
        subMenu.style.removeProperty('bottom')
        subMenu.style.removeProperty('left')
        subMenu.style.removeProperty('right')

        if (hasOwnProp(styles, 'top'))
          subMenu.style.top = styles.top as string
        if (hasOwnProp(styles, 'left'))
          subMenu.style.left = styles.left as string
        if (hasOwnProp(styles, 'bottom'))
          subMenu.style.bottom = styles.bottom as string
        if (hasOwnProp(styles, 'right'))
          subMenu.style.right = styles.right as string
        subMenu.classList.add(cssClasses.menuVisible)

        this.registerHandlers()
        this.setState({ selectedItem: null })
      })
    } else {
      const subMenu = this.subMenu
      if (!subMenu) return
      const cleanup = () => {
        subMenu.removeEventListener('transitionend', cleanup)
        subMenu.style.removeProperty('bottom')
        subMenu.style.removeProperty('right')
        subMenu.style.top = '0'
        subMenu.style.left = '100%'
        this.unregisterHandlers()
      }
      subMenu.addEventListener('transitionend', cleanup)
      subMenu.classList.remove(cssClasses.menuVisible)
    }
  }

  componentWillUnmount() {
    if (this.listenId) {
      listener.unregister(this.listenId)
    }

    if (this.opentimer) clearTimeout(this.opentimer)

    if (this.closetimer) clearTimeout(this.closetimer)

    this.unregisterHandlers(true)
  }

  render() {
    const {
      children,
      attributes = {},
      disabled = false,
      title,
      selected = false,
      className = '',
      onMouseOut,
      onMouseMove,
    } = this.props
    const visible = this.state.visible

    const menuProps = {
      ref: this.menuRef,
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
      className: cx(
        cssClasses.menuItem,
        cssClasses.subMenu,
        attributes.listClassName,
      ),
      style: {
        position: 'relative',
      } as React.CSSProperties,
    }
    const menuItemProps = {
      className: cx(cssClasses.menuItem, attributes.className, {
        [cx(cssClasses.menuItemDisabled, attributes.disabledClassName)]:
          disabled,
        [cx(cssClasses.menuItemActive, attributes.visibleClassName)]: visible,
        [cx(cssClasses.menuItemSelected, attributes.selectedClassName)]:
          selected,
      }),
      onMouseMove,
      onMouseOut,
      onClick: this.handleClick,
    }
    const subMenuProps = {
      ref: this.subMenuRef,
      style: {
        position: 'absolute',
        transition: 'opacity 1ms', // trigger transitionend event
        top: 0,
        left: '100%',
      } as React.CSSProperties,
      className: cx(cssClasses.menu, className),
    }

    return (
      <nav
        {...menuProps}
        role="menuitem"
        tabIndex={-1}
        aria-haspopup="true"
      >
        <div
          {...attributes}
          {...menuItemProps}
        >
          {title}
        </div>
        <nav
          {...subMenuProps}
          role="menu"
          tabIndex={-1}
        >
          {this.renderChildren(children)}
        </nav>
      </nav>
    )
  }
}

export default SubMenu
