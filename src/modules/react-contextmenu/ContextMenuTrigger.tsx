import React, { Component } from 'react'
import cx from 'classnames'

import { showMenu, hideMenu } from './actions.ts'
import { callIfExists, cssClasses } from './helpers.ts'

interface TriggerEvent extends React.SyntheticEvent<HTMLElement> {
  button?: number
  clientX?: number
  clientY?: number
  shiftKey?: boolean
  touches?: React.TouchList
}

export interface ContextMenuTriggerProps {
  attributes?: React.HTMLAttributes<HTMLElement> & Record<string, unknown>
  children?: React.ReactNode
  id: string
  collect?: (
    props: ContextMenuTriggerProps,
  ) => Record<string, unknown> | Promise<Record<string, unknown>> | null
  disable?: boolean
  disableIfShiftIsPressed?: boolean
  holdToDisplay?: number
  posX?: number
  posY?: number
  renderTag?: React.ElementType
  // arbitrary props are allowed: they are passed through to collect()
  [key: string]: unknown
}

interface ShowMenuConfig {
  position: { x: number; y: number }
  target: HTMLElement | null
  id: string
  data?: Record<string, unknown>
}

class ContextMenuTrigger extends Component<ContextMenuTriggerProps> {
  touchHandled = false
  mouseDownTimeoutId: ReturnType<typeof setTimeout> | undefined
  touchstartTimeoutId: ReturnType<typeof setTimeout> | undefined
  elem: HTMLElement | null = null

  handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    if ((this.props.holdToDisplay ?? 1000) >= 0 && event.button === 0) {
      event.persist()
      event.stopPropagation()

      this.mouseDownTimeoutId = setTimeout(() => {
        this.handleContextClick(event)
      }, this.props.holdToDisplay ?? 1000)
    }
    callIfExists(this.props.attributes?.onMouseDown, event)
  }

  handleMouseUp = (event: React.MouseEvent<HTMLElement>) => {
    if (event.button === 0) {
      clearTimeout(this.mouseDownTimeoutId)
    }
    callIfExists(this.props.attributes?.onMouseUp, event)
  }

  handleMouseOut = (event: React.MouseEvent<HTMLElement>) => {
    if (event.button === 0) {
      clearTimeout(this.mouseDownTimeoutId)
    }
    callIfExists(this.props.attributes?.onMouseOut, event)
  }

  handleTouchstart = (event: React.TouchEvent<HTMLElement>) => {
    this.touchHandled = false

    if ((this.props.holdToDisplay ?? 1000) >= 0) {
      event.persist()
      event.stopPropagation()

      this.touchstartTimeoutId = setTimeout(() => {
        this.handleContextClick(event)
        this.touchHandled = true
      }, this.props.holdToDisplay ?? 1000)
    }
    callIfExists(this.props.attributes?.onTouchStart, event)
  }

  handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (this.touchHandled) {
      event.preventDefault()
    }
    clearTimeout(this.touchstartTimeoutId)
    callIfExists(this.props.attributes?.onTouchEnd, event)
  }

  handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (event.button === 2) {
      this.handleContextClick(event)
    }
    callIfExists(this.props.attributes?.onContextMenu, event)
  }

  handleMouseClick = (event: React.MouseEvent<HTMLElement>) => {
    if (event.button === 2) {
      this.handleContextClick(event)
    }
    callIfExists(this.props.attributes?.onClick, event)
  }

  handleContextClick = (event: TriggerEvent) => {
    if (this.props.disable) return
    if (this.props.disableIfShiftIsPressed && event.shiftKey) return

    event.preventDefault()
    event.stopPropagation()

    let x = (event.clientX || event.touches?.[0]?.pageX) ?? 0
    let y = (event.clientY || event.touches?.[0]?.pageY) ?? 0

    if (this.props.posX) {
      x -= this.props.posX
    }
    if (this.props.posY) {
      y -= this.props.posY
    }

    hideMenu()

    const data = callIfExists(
      this.props.collect ?? (() => null),
      this.props,
    ) as Record<string, unknown> | Promise<Record<string, unknown>> | null
    const showMenuConfig: ShowMenuConfig = {
      position: { x: x ?? 0, y: y ?? 0 },
      target: this.elem,
      id: this.props.id,
    }
    if (data && typeof (data as Promise<unknown>).then === 'function') {
      // it's promise
      ;(data as Promise<Record<string, unknown>>).then((resp) => {
        showMenuConfig.data = { ...resp, target: event.target }
        showMenu(showMenuConfig)
      })
    } else {
      showMenuConfig.data = { ...(data as Record<string, unknown>), target: event.target }
      showMenu(showMenuConfig)
    }
  }

  elemRef = (c: HTMLElement | null) => {
    this.elem = c
  }

  render() {
    const { renderTag = 'div', attributes = {}, children } = this.props

    const newAttrs = {
      ...attributes,
      className: cx(cssClasses.menuWrapper, attributes.className),
      onContextMenu: this.handleContextMenu,
      onClick: this.handleMouseClick,
      onMouseDown: this.handleMouseDown,
      onMouseUp: this.handleMouseUp,
      onTouchStart: this.handleTouchstart,
      onTouchEnd: this.handleTouchEnd,
      onMouseOut: this.handleMouseOut,
      ref: this.elemRef,
    }

    return React.createElement(renderTag, newAttrs, children)
  }
}

export default ContextMenuTrigger
