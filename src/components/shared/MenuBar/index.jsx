import {
  memo,
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
  Children,
  cloneElement,
} from 'react'
import { useResizeDetector } from 'react-resize-detector'
import { IconButton, Menu, MenuItem } from '@mui/material'
import {
  FaBars,
  FaAlignLeft,
  FaAlignRight,
  FaArrowDown,
  FaArrowRight,
  FaArrowLeft,
  FaArrowUp,
  FaCaretDown,
  FaCaretLeft,
  FaCaretRight,
  FaCaretUp,
} from 'react-icons/fa6'
import styled from 'styled-components'
import { over, set } from 'lodash'
import { useAtom, atom } from 'jotai'
import { useDebouncedCallback } from 'use-debounce'

const Container = styled.div`
  overflow-y: hidden;
  overflow-x: hidden;
  max-height: 50px;
  padding: 5px;
  margin-left: auto;
  margin-right: 0;
  margin-top: auto;
  margin-bottom: auto;
`

const buttonWidth = 40
const gapWidth = 5

const overflowingAtom = atom(false)
const widthAtom = atom(0)

// TODO: pass in Tools as children?
// or rather: need info for menu AND button
// so: object with: title, iconComponent, onClick, width?
// then: build menu and or buttons from that
export const MenuBar = memo(({ children }) => {
  const usableChildren = children.filter((child) => !!child)
  const containerRef = useRef(null)
  const previousWidthRef = useRef(null)
  const previousMeasurementTimeRef = useRef(0)
  const childrenCount = Children.count(usableChildren)
  const [menuChildrenCount, setMenuChildrenCount] = useState(0)

  const buttonChildren = Children.map(usableChildren, (child, index) => {
    if (!(index + 1 <= childrenCount - menuChildrenCount)) return null
    if (!child) return null
    return cloneElement(child)
  }).filter((child) => !!child)

  const menuChildren = Children.map(usableChildren, (child, index) => {
    if (!(index + 1 > childrenCount - menuChildrenCount)) return null
    if (!child) return null
    return cloneElement(child)
  }).filter((child) => !!child)

  console.log('MenuBar', {
    usableChildren,
    buttonChildren,
    menuChildren,
    childrenCount,
    menuChildrenCount,
    menuChildrenLength: menuChildren.length,
  })

  const incrementNumberOfMenuChildren = useCallback(() => {
    console.log('MenuBar.incrementNumberOfMenuChildren')
    setMenuChildrenCount((prev) => prev + 1)
  }, [])
  const decrementNumberOfMenuChildren = useCallback(() => {
    console.log('MenuBar.decrementNumberOfMenuChildren')
    setMenuChildrenCount((prev) => prev - 1)
  }, [])

  // this was quite some work to get right
  // overflowing should only be changed as rarely as possible to prevent unnecessary rerenders
  const checkOverflow = useCallback(() => {
    if (!containerRef.current) return

    // only change if overflowing has changed
    const { clientWidth, scrollWidth, scrollHeight, clientHeight } =
      containerRef.current
    // the left margin of the container is the room available
    const containerStyle = window.getComputedStyle(containerRef.current)
    const containerMarginLeft = parseFloat(containerStyle.marginLeft)

    const needToIncrement =
      scrollWidth > clientWidth + 50 || scrollHeight > clientHeight
    const needToDecrement = containerMarginLeft > buttonWidth

    console.log('MenuBar.checkOverflow', {
      clientWidth,
      scrollWidth,
      clientHeight,
      scrollHeight,
      needToIncrement,
      needToDecrement,
      containerMarginLeft: parseFloat(containerStyle.marginLeft),
    })

    // TODO: set number of menu children instead
    needToIncrement && incrementNumberOfMenuChildren()
    needToDecrement && decrementNumberOfMenuChildren()
    // TODO: need to move children from menu to buttons and vice versa
  }, [])

  const checkOverflowDebounced = useDebouncedCallback(checkOverflow, 300)

  useEffect(() => {
    if (!containerRef.current) return
    // set up a resize observer for the container
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        // console.log('MenuBar.resizeObserver, measuring')

        // only go on if enough time has past since the last measurement (prevent unnecessary rerenders)
        const currentTime = Date.now()
        const timeSinceLastMeasurement =
          currentTime - previousMeasurementTimeRef.current
        if (timeSinceLastMeasurement < 300) return

        // only go on if the width has changed enough (prevent unnecessary rerenders)
        previousMeasurementTimeRef.current = currentTime
        const percentageChanged =
          ((width - previousWidthRef.current) / width) * 100
        const shouldCheckOverflow = Math.abs(percentageChanged) > 1
        console.log('MenuBar.resizeObserver', {
          width,
          percentageChanged,
          shouldCheckOverflow,
        })
        if (!shouldCheckOverflow) return

        previousWidthRef.current = width
        checkOverflowDebounced()
      }
    })

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  const onClickMenuButton = useCallback((event) => {
    console.log('MenuBar.onClickMenuButton', { event })
    setMenuAnchorEl(event.currentTarget)
  })
  const onCloseMenu = useCallback(() => {
    console.log('MenuBar.onCloseMenu')
    setMenuAnchorEl(null)
  }, [])
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const menuIsOpen = Boolean(menuAnchorEl)

  return (
    <Container ref={containerRef}>
      {buttonChildren}
      <IconButton
        id="menubutton"
        onClick={onClickMenuButton}
      >
        <FaBars />
      </IconButton>
      {!!menuChildrenCount && (
        <Menu
          id="menubutton"
          anchorEl={menuAnchorEl}
          open={menuIsOpen}
          onClose={onCloseMenu}
        >
          {menuChildren}
        </Menu>
      )}
    </Container>
  )
})