import React, { Component } from 'react'

import MenuItem from './MenuItem.tsx'

export interface AbstractMenuProps {
  children?: React.ReactNode
}

export interface AbstractMenuState {
  selectedItem: React.ReactElement | null
  forceSubMenuOpen: boolean
  // set by ContextMenu, checked here because the methods are shared with SubMenu
  isVisible?: boolean
}

// shared base of ContextMenu and SubMenu: key navigation and child rendering
abstract class AbstractMenu<
  Props extends AbstractMenuProps = AbstractMenuProps,
  State extends AbstractMenuState = AbstractMenuState,
> extends Component<Props, State> {
  seletedItemRef: { ref?: HTMLElement | null; props: { disabled?: boolean } } | null = null

  abstract getSubMenuType(): React.ComponentType<any>

  // assigned by ContextMenu; intentionally left unassigned on SubMenu (as upstream)
  declare hideMenu: (e: React.KeyboardEvent) => void

  // initialized by subclasses (originally done in the compiled constructors)
  declare state: Readonly<State>

  handleKeyNavigation = (e: React.KeyboardEvent) => {
    // check for isVisible strictly here as it might be undefined when this code executes in the context of SubMenu
    // but we only need to check when it runs in the ContextMenu context
    if (this.state.isVisible === false) {
      return
    }

    switch (e.keyCode) {
      case 37: // left arrow
      case 27:
        // escape
        e.preventDefault()
        this.hideMenu(e)
        break
      case 38:
        // up arrow
        e.preventDefault()
        this.selectChildren(true)
        break
      case 40:
        // down arrow
        e.preventDefault()
        this.selectChildren(false)
        break
      case 39:
        // right arrow
        this.tryToOpenSubMenu(e)
        break
      case 13:
        // enter
        e.preventDefault()
        this.tryToOpenSubMenu(e)
        {
          // determine the selected item is disabled or not
          const disabled =
            this.seletedItemRef &&
            this.seletedItemRef.props &&
            this.seletedItemRef.props.disabled

          if (
            this.seletedItemRef &&
            this.seletedItemRef.ref instanceof HTMLElement &&
            !disabled
          ) {
            this.seletedItemRef.ref.click()
          } else {
            this.hideMenu(e)
          }
        }
        break
      default:
      // do nothing
    }
  }

  handleForceClose = () => {
    this.setState({ forceSubMenuOpen: false })
  }

  tryToOpenSubMenu = (e: React.KeyboardEvent) => {
    if (
      this.state.selectedItem &&
      this.state.selectedItem.type === this.getSubMenuType()
    ) {
      e.preventDefault()
      this.setState({ forceSubMenuOpen: true })
    }
  }

  selectChildren = (forward: boolean) => {
    const selectedItem = this.state.selectedItem

    const children: React.ReactElement[] = []
    let disabledChildrenCount = 0
    const disabledChildIndexes: Record<number, boolean> = {}

    const childCollector = (child: React.ReactNode, index: number) => {
      // child can be empty in case you do conditional rendering of components, in which
      // case it should not be accounted for as a real child
      if (!child || !React.isValidElement(child)) {
        return
      }
      const element = child as React.ReactElement<{ divider?: boolean; disabled?: boolean; children?: React.ReactNode }>

      if (([MenuItem, this.getSubMenuType()] as React.ComponentType<any>[]).indexOf(element.type as React.ComponentType<any>) < 0) {
        // Maybe the MenuItem or SubMenu is capsuled in a wrapper div or something else
        React.Children.forEach(element.props.children, childCollector)
      } else if (!element.props.divider) {
        if (element.props.disabled) {
          ++disabledChildrenCount
          disabledChildIndexes[index] = true
        }

        children.push(element)
      }
    }

    React.Children.forEach(this.props.children, childCollector)
    if (disabledChildrenCount === children.length) {
      // All menu items are disabled, so none can be selected, don't do anything
      return
    }

    const findNextEnabledChildIndex = (currentIndex: number) => {
      let i = currentIndex
      const incrementCounter = () => {
        if (forward) {
          --i
        } else {
          ++i
        }

        if (i < 0) {
          i = children.length - 1
        } else if (i >= children.length) {
          i = 0
        }
      }

      do {
        incrementCounter()
      } while (i !== currentIndex && disabledChildIndexes[i])

      return i === currentIndex ? null : i
    }

    const currentIndex = children.indexOf(selectedItem as React.ReactElement)
    const nextEnabledChildIndex = findNextEnabledChildIndex(currentIndex)

    if (nextEnabledChildIndex !== null) {
      this.setState({
        selectedItem: children[nextEnabledChildIndex] ?? null,
        forceSubMenuOpen: false,
      })
    }
  }

  onChildMouseMove = (child: React.ReactElement) => {
    if (this.state.selectedItem !== child) {
      this.setState({ selectedItem: child, forceSubMenuOpen: false })
    }
  }

  onChildMouseLeave = () => {
    this.setState({ selectedItem: null, forceSubMenuOpen: false })
  }

  renderChildren = (
    children: React.ReactNode,
  ): React.ReactNode =>
    React.Children.map(children, (child) => {
      const props: Record<string, unknown> = {}
      if (!React.isValidElement(child)) return child
      const element = child as React.ReactElement<Record<string, unknown>>
      if (([MenuItem, this.getSubMenuType()] as React.ComponentType<any>[]).indexOf(element.type as React.ComponentType<any>) < 0) {
        // Maybe the MenuItem or SubMenu is capsuled in a wrapper div or something else
        props.children = this.renderChildren(element.props.children as React.ReactNode)
        return React.cloneElement(element, props)
      }
      props.onMouseLeave = this.onChildMouseLeave
      if (element.type === this.getSubMenuType()) {
        // special props for SubMenu only
        props.forceOpen =
          this.state.forceSubMenuOpen && this.state.selectedItem === child
        props.forceClose = this.handleForceClose
        props.parentKeyNavigationHandler = this.handleKeyNavigation
      }
      if (!element.props.divider && this.state.selectedItem === child) {
        // special props for selected item only
        props.selected = true
        props.ref = (ref: unknown) => {
          this.seletedItemRef = ref as this['seletedItemRef']
        }
        return React.cloneElement(element, props)
      }
      // onMouseMove is only needed for non selected items
      props.onMouseMove = () => this.onChildMouseMove(child as React.ReactElement)
      return React.cloneElement(element, props)
    })
}

export default AbstractMenu
