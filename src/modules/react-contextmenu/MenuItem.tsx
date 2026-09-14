import React, { Component } from 'react'
import cx from 'classnames'

import { hideMenu } from './actions.ts'
import { callIfExists, cssClasses, store } from './helpers.ts'

export interface MenuItemAttributes extends React.HTMLAttributes<HTMLDivElement> {
  disabledClassName?: string
  dividerClassName?: string
  selectedClassName?: string
}

export interface MenuItemProps {
  attributes?: MenuItemAttributes
  children?: React.ReactNode
  className?: string
  data?: Record<string, unknown>
  disabled?: boolean
  divider?: boolean
  onClick?: (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    data: Record<string, unknown>,
    target: EventTarget | null | undefined,
  ) => void
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
  onMouseMove?: React.MouseEventHandler<HTMLDivElement>
  preventClose?: boolean
  selected?: boolean
}

class MenuItem extends Component<MenuItemProps> {
  ref: HTMLElement | null = null

  handleClick = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    // touch events have no button property (undefined !== 0), so preventDefault runs for them too
    const button = (event as React.MouseEvent<HTMLDivElement>).button
    if (button !== 0 && button !== 1) {
      event.preventDefault()
    }

    if (this.props.disabled || this.props.divider) return

    callIfExists(
      this.props.onClick,
      event,
      Object.assign({}, this.props.data ?? {}, store.data),
      store.target,
    )

    if (this.props.preventClose) return

    hideMenu()
  }

  render() {
    const {
      attributes = {},
      children = null,
      className = '',
      disabled = false,
      divider = false,
      selected = false,
    } = this.props

    const menuItemClassNames = cx(
      className,
      cssClasses.menuItem,
      attributes.className,
      {
        [cx(cssClasses.menuItemDisabled, attributes.disabledClassName)]:
          disabled,
        [cx(cssClasses.menuItemDivider, attributes.dividerClassName)]: divider,
        [cx(cssClasses.menuItemSelected, attributes.selectedClassName)]:
          selected,
      },
    )

    return (
      <div
        {...attributes}
        className={menuItemClassNames}
        role="menuitem"
        tabIndex={-1}
        aria-disabled={disabled ? 'true' : 'false'}
        aria-orientation={divider ? 'horizontal' : undefined}
        ref={(ref) => {
          this.ref = ref
        }}
        onMouseMove={this.props.onMouseMove}
        onMouseLeave={this.props.onMouseLeave}
        onTouchEnd={this.handleClick}
        onClick={this.handleClick}
      >
        {divider ? null : children}
      </div>
    )
  }
}

export default MenuItem
