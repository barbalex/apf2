import {
  memo,
  useMemo,
  useRef,
  useState,
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
import styled from '@emotion/styled'
import { over, set } from 'lodash'
import { useDebouncedCallback } from 'use-debounce'

const buttonSize = 40

const MeasuredOuterContainer = styled.div`
  overflow: hidden;
  max-height: ${buttonSize}px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  // needed as in fullscreen backed by black
  background-color: rgb(255, 253, 231);
  // TODO: decide later on styling
  border-top: 1px solid rgba(46, 125, 50, 0.15);
  border-bottom: 1px solid rgba(46, 125, 50, 0.15);
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
  display: flex;
  padding: 0 10px;
  max-height: ${buttonSize}px;
`
// remove the margin mui adds to top and bottom of menu
const StyledMenu = styled(Menu)`
  ul {
    padding: 0 !important;
  }
`

export const MenuBar = memo(
  ({ children, isPreview, titleComponent, titleComponentWidth = 60 }) => {
    const usableChildren = useMemo(
      () => children.filter((child) => !!child),
      [children],
    )
    const outerContainerRef = useRef(null)
    const innerContainerRef = useRef(null)

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

    // console.log('MenuBar', {
    //   usableChildren,
    //   buttonChildren,
    //   menuChildren,
    //   childrenCount,
    //   menuChildrenCount,
    // })

    const incrementMenuChildrenCount = useCallback(
      () => setMenuChildrenCount((prev) => prev + 1),
      [],
    )
    const incrementMenuChildrenCountRevealingMenu = useCallback(
      () => setMenuChildrenCount((prev) => prev + 2),
      [],
    )
    const decrementMenuChildrenCount = useCallback(
      () => setMenuChildrenCount((prev) => prev - 1),
      [],
    )
    const decrementMenuChildrenCountHidingMenu = useCallback(
      () => setMenuChildrenCount((prev) => prev - menuChildrenCount),
      [menuChildrenCount],
    )

    // this was quite some work to get right
    // overflowing should only be changed as rarely as possible to prevent unnecessary rerenders
    const checkOverflow = useCallback(() => {
      if (!outerContainerRef.current) return

      // only change if overflowing has changed
      const {
        clientWidth: containerWidth,
        scrollWidth: containerScrollWidth,
        scrollHeight: containerScrollHeight,
        clientHeight: containerHeight,
      } = outerContainerRef.current

      const titleWidth = titleComponent ? titleComponentWidth : 0
      const growableSpace =
        containerWidth - titleWidth - innerContainerRef.current.clientWidth

      const needToIncrement =
        growableSpace < 0 ||
        containerScrollWidth > containerWidth + buttonSize ||
        containerScrollHeight > containerHeight
      const needToIncrementRevealingMenu =
        needToIncrement && menuChildrenCount === 0
      const needToDecrement =
        growableSpace > buttonSize && menuChildrenCount > 0
      const needToDecrementHidingMenu = needToDecrement && menuChildrenCount < 3

      // console.log('MenuBar.checkOverflow')

      // console.log('MenuBar.checkOverflow', {
      //   containerWidth,
      //   innerContainerWidth: innerContainerRef.current.clientWidth,
      //   containerScrollWidth,
      //   containerHeight,
      //   containerScrollHeight,
      //   needToIncrement,
      //   needToIncrementRevealingMenu,
      //   needToDecrement,
      //   growableSpace,
      //   usableChildren,
      //   buttonChildren,
      //   menuChildren,
      //   childrenCount,
      //   menuChildrenCount,
      //   titleWidth,
      // })

      if (needToIncrementRevealingMenu) {
        return incrementMenuChildrenCountRevealingMenu()
      }
      if (needToIncrement) return incrementMenuChildrenCount()
      if (needToDecrementHidingMenu) {
        return decrementMenuChildrenCountHidingMenu()
      }
      if (needToDecrement) decrementMenuChildrenCount()
    }, [menuChildrenCount])

    const checkOverflowDebounced = useDebouncedCallback(checkOverflow, 300)

    useEffect(() => {
      // reset children count
      setMenuChildrenCount(0)
      // and check overflow when preview changes
      // console.log('MenuBar.useEffect, calling checkOverflow')
      checkOverflow()
    }, [isPreview])

    const previousWidthRef = useRef(null)
    useEffect(() => {
      if (!outerContainerRef.current) {
        // console.log('MenuBar.useEffect, no containerRef')
        return
      }
      // set up a resize observer for the container
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width

          // only go on if enough time has past since the last measurement (prevent unnecessary rerenders)
          const currentTime = Date.now()
          const timeSinceLastMeasurement =
            currentTime - previousMeasurementTimeRef.current
          if (timeSinceLastMeasurement < 300) {
            // console.log('MenuBar.resizeObserver, not enough time has passed')
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
            // console.log('MenuBar.resizeObserver, not enough change')
            return
          }

          previousWidthRef.current = width
          // console.log('MenuBar.resizeObserver, calling checkOverflowDebounced')
          checkOverflowDebounced()
        }
      })

      observer.observe(outerContainerRef.current)

      return () => {
        // console.log('MenuBar.useEffect, observer.disconnect')
        observer.disconnect()
      }
    }, [previousWidthRef.current, isPreview, menuChildrenCount])

    const onClickMenuButton = useCallback((event) =>
      setMenuAnchorEl(event.currentTarget),
    )
    const onCloseMenu = useCallback(() => setMenuAnchorEl(null), [])
    const [menuAnchorEl, setMenuAnchorEl] = useState(null)
    const menuIsOpen = Boolean(menuAnchorEl)

    return (
      <MeasuredOuterContainer ref={outerContainerRef}>
        {titleComponent}
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
  },
)
