import {
  memo,
  useMemo,
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

const buttonSize = 40

const MeasuredOuterContainer = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`
// align items to the right
const InnerContainer = styled.div`
  max-height: ${buttonSize}px;
  margin-left: auto;
  margin-right: 0;
  margin-top: auto;
  margin-bottom: auto;
`
const StylingContainer = styled.div`
  padding: 0 5px;
`
// remove the margin mui adds to top and bottom of menu
const StyledMenu = styled(Menu)`
  ul {
    padding: 0 !important;
  }
`

const overflowingAtom = atom(false)
const widthAtom = atom(0)

// TODO: pass in Tools as children?
// or rather: need info for menu AND button
// so: object with: title, iconComponent, onClick, width?
// then: build menu and or buttons from that
export const MenuBar = memo(({ children }) => {
  const usableChildren = useMemo(
    () => children.filter((child) => !!child),
    [children],
  )
  const outerContainerRef = useRef(null)
  const innerContainerRef = useRef(null)

  const previousWidthRef = useRef(null)
  const previousMeasurementTimeRef = useRef(0)
  const childrenCount = Children.count(usableChildren)
  const [menuChildrenCount, setMenuChildrenCount] = useState(0)

  const buttonChildren = useMemo(
    () =>
      Children.map(usableChildren, (child, index) => {
        if (!(index + 1 <= childrenCount - menuChildrenCount)) return null
        if (!child) return null
        return cloneElement(child)
      }).filter((child) => !!child),
    [usableChildren, childrenCount, menuChildrenCount],
  )

  const menuChildren = useMemo(
    () =>
      Children.map(usableChildren, (child, index) => {
        if (!(index + 1 > childrenCount - menuChildrenCount)) return null
        if (!child) return null
        return cloneElement(child)
      }).filter((child) => !!child),
    [usableChildren, childrenCount, menuChildrenCount],
  )

  console.log('MenuBar', {
    usableChildren,
    buttonChildren,
    menuChildren,
    childrenCount,
    menuChildrenCount,
    menuChildrenLength: menuChildren.length,
  })

  const incrementMenuChildrenCount = useCallback(() => {
    setMenuChildrenCount((prev) => {
      console.log('MenuBar.incrementNumberOfMenuChildren from:', {
        prev,
        to: prev + 1,
      })
      return prev + 1
    })
  }, [])
  const incrementMenuChildrenCountRevealingMenu = useCallback(() => {
    setMenuChildrenCount((prev) => {
      console.log('MenuBar.incrementNumberOfMenuChildrenRevealingMenu from:', {
        prev,
        to: prev + 2,
      })
      return prev + 2
    })
  }, [])
  const decrementMenuChildrenCount = useCallback(() => {
    setMenuChildrenCount((prev) => {
      console.log('MenuBar.decrementNumberOfMenuChildren from:', {
        prev,
        to: prev - 1,
      })
      return prev - 1
    })
  }, [])
  const decrementMenuChildrenCountHidingMenu = useCallback(() => {
    setMenuChildrenCount((prev) => {
      console.log('MenuBar.decrementNumberOfMenuChildrenHidingMenu from:', {
        prev,
        to: prev - menuChildrenCount,
      })
      return prev - menuChildrenCount
    })
  }, [menuChildrenCount])

  // this was quite some work to get right
  // overflowing should only be changed as rarely as possible to prevent unnecessary rerenders
  const checkOverflow = useCallback(() => {
    if (!outerContainerRef.current) return

    // only change if overflowing has changed
    const { clientWidth, scrollWidth, scrollHeight, clientHeight } =
      outerContainerRef.current

    // the left margin of the container is the room available
    const containerStyle = window.getComputedStyle(outerContainerRef.current)
    const growableSpace = clientWidth - innerContainerRef.current.clientWidth

    const needToIncrement =
      scrollWidth > clientWidth + 50 || scrollHeight > clientHeight
    const needToIncrementRevealingMenu =
      needToIncrement && menuChildrenCount === 0
    const needToDecrement = growableSpace > buttonSize && menuChildrenCount > 0
    const needToDecrementHidingMenu = needToDecrement && menuChildrenCount < 3

    console.log('MenuBar.checkOverflow', {
      clientWidth,
      scrollWidth,
      clientHeight,
      scrollHeight,
      needToIncrement,
      needToIncrementRevealingMenu,
      needToDecrement,
      growableSpace,
    })

    // TODO: set number of menu children instead
    if (needToIncrementRevealingMenu) {
      return incrementMenuChildrenCountRevealingMenu()
    }
    if (needToIncrement) return incrementMenuChildrenCount()
    if (needToDecrementHidingMenu) {
      return decrementMenuChildrenCountHidingMenu()
    }
    if (needToDecrement) decrementMenuChildrenCount()
    // TODO: need to move children from menu to buttons and vice versa
  }, [menuChildrenCount])

  const checkOverflowDebounced = useDebouncedCallback(checkOverflow, 300)

  useEffect(() => {
    if (!outerContainerRef.current) {
      console.log('MenuBar.useEffect, no containerRef')
      return
    }
    // set up a resize observer for the container
    const observer = new ResizeObserver((entries) => {
      console.log('MenuBar.resizeObserver, entries:', entries)
      for (const entry of entries) {
        const width = entry.contentRect.width
        console.log('MenuBar.resizeObserver, measuring, width:', width)

        // only go on if enough time has past since the last measurement (prevent unnecessary rerenders)
        const currentTime = Date.now()
        const timeSinceLastMeasurement =
          currentTime - previousMeasurementTimeRef.current
        if (timeSinceLastMeasurement < 300) {
          console.log('MenuBar.resizeObserver, not enough time has passed')
          return
        }

        // only go on if the width has changed enough (prevent unnecessary rerenders)
        // this is the reason for not using react-resize-detector
        previousMeasurementTimeRef.current = currentTime
        const percentageChanged = Math.abs(
          ((width - previousWidthRef.current) / width) * 100,
        )
        const shouldCheckOverflow = Math.abs(percentageChanged) > 1
        if (!shouldCheckOverflow) {
          console.log('MenuBar.resizeObserver, not enough change')
          return
        }

        previousWidthRef.current = width
        checkOverflowDebounced()
      }
    })

    observer.observe(outerContainerRef.current)

    return () => {
      console.log('MenuBar.useEffect, observer.disconnect')
      observer.disconnect()
    }
  }, [previousWidthRef.current])

  const onClickMenuButton = useCallback((event) =>
    setMenuAnchorEl(event.currentTarget),
  )
  const onCloseMenu = useCallback(() => setMenuAnchorEl(null), [])
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const menuIsOpen = Boolean(menuAnchorEl)

  return (
    <MeasuredOuterContainer ref={outerContainerRef}>
      <InnerContainer ref={innerContainerRef}>
        <StylingContainer>
          {buttonChildren}
          {!!menuChildren.length && (
            <>
              <IconButton
                id="menubutton"
                onClick={onClickMenuButton}
              >
                <FaBars />
              </IconButton>

              <StyledMenu
                id="menubutton"
                anchorEl={menuAnchorEl}
                open={menuIsOpen}
                onClose={onCloseMenu}
              >
                {menuChildren}
              </StyledMenu>
            </>
          )}
        </StylingContainer>
      </InnerContainer>
    </MeasuredOuterContainer>
  )
})
