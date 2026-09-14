import React, { Component } from 'react'

import listener, { type MenuEvent } from './globalEventListener.ts'

// collect ContextMenuTrigger's expected props to NOT pass them on as part of the context
const ignoredTriggerProps = [
  'id',
  'children',
  'attributes',
  'collect',
  'disable',
  'holdToDispla',
  'posX',
  'posY',
  'renderTag',
  'mouseButton',
  'disableIfShiftIsPressed',
]

// expect the id of the menu to be responsible for as outer parameter
export default function connectMenu(menuId: string) {
  // expect menu component to connect as inner parameter
  // <Child/> is presumably a wrapper of <ContextMenu/>
  return function connect(Child: React.ComponentType<any>) {
    // return wrapper for <Child/> that forwards the ContextMenuTrigger's additional props
    return class ConnectMenu extends Component<
      Record<string, unknown>,
      { trigger: Record<string, unknown> | null }
    > {
      listenId: string | undefined
      state = { trigger: null }

      handleShow = (e: MenuEvent) => {
        if (e.detail.id !== menuId) return

        // the onShow event's detail.data object holds all ContextMenuTrigger props
        const data = (e.detail.data ?? {}) as Record<string, unknown>

        const filteredData: Record<string, unknown> = {}

        for (const key in data) {
          // exclude props the ContextMenuTrigger is expecting itself
          if (!ignoredTriggerProps.includes(key)) {
            filteredData[key] = data[key]
          }
        }
        this.setState({ trigger: filteredData })
      }

      handleHide = () => {
        this.setState({ trigger: null })
      }

      componentDidMount() {
        this.listenId = listener.register(this.handleShow, this.handleHide)
      }

      componentWillUnmount() {
        if (this.listenId) {
          listener.unregister(this.listenId)
        }
      }

      render() {
        return (
          <Child
            {...this.props}
            id={menuId}
            trigger={this.state.trigger}
          />
        )
      }
    }
  }
}
