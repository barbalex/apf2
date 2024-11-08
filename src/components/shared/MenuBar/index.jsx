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

const buttonHeight = 40
const buttonWidth = 40

const MeasuredOuterContainer = styled.div`
  overflow: hidden;
  min-height: ${buttonHeight}px;
  max-height: ${buttonHeight}px;
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
  min-height: ${buttonHeight}px;
  max-height: ${buttonHeight}px;
  margin-left: auto;
  margin-right: 0;
  margin-top: auto;
  margin-bottom: auto;
`
const StylingContainer = styled.div`
  display: flex;
  padding: 0 10px;
  max-height: ${buttonHeight}px;
`
// remove the margin mui adds to top and bottom of menu
const StyledMenu = styled(Menu)`
  ul {
    padding: 0 !important;
  }
`
// the rerenderer ensures re-calculating the overflow when the children change due to special effects
// example: changing to preview for files
// TODO: enable passing in elements with different widths
// use childrenWidths array for that?
export const MenuBar = memo(
  ({
    children,
    widths,
    rerenderer,
    titleComponent,
    titleComponentWidth = 60,
  }) => {
    const usableChildren = useMemo(
      () => children?.filter?.((child) => !!child) ?? children,
      [children],
    )
    const childrenCount = Children.count(usableChildren)

    const [menusCount, setMenusCount] = useState(0)

    const buttons = useMemo(
      () =>
        Children.map(usableChildren, (child, index) => {
          if (!(index + 1 <= childrenCount - menusCount)) return null
          if (!child) return null
          return cloneElement(child)
        }).filter((child) => !!child),
      [usableChildren, childrenCount, menusCount],
    )

    const menus = useMemo(
      () =>
        Children.map(usableChildren, (child, index) => {
          if (!(index + 1 > childrenCount - menusCount)) return null
          if (!child) return null
          return cloneElement(child)
        }).filter((child) => !!child),
      [usableChildren, childrenCount, menusCount],
    )

    const outerContainerRef = useRef(null)
    const innerContainerRef = useRef(null)
    const previousMeasurementTimeRef = useRef(0)

    // console.log('MenuBar', {
    //   usableChildren,
    //   buttons,
    //   menus,
    //   childrenCount,
    //   menusCount,
    // })

    const incrementMenusCount = useCallback(
      () => setMenusCount((prev) => prev + 1),
      [],
    )
    const incrementMenusCountRevealingMenu = useCallback(
      () => setMenusCount((prev) => prev + 2),
      [],
    )
    const decrementMenusCount = useCallback(
      () => setMenusCount((prev) => prev - 1),
      [],
    )
    const decrementMenusCountHidingMenu = useCallback(
      () => setMenusCount((prev) => prev - menusCount),
      [menusCount],
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

      // TODO: instead of buttonWidth, use the passed in width of the last button
      const widthOfLastButton = widths?.[buttons.length - 1] ?? buttonWidth
      const widthOfFirstMenu = widths?.[buttons.length] ?? buttonWidth
      const needToIncrementMenus =
        growableSpace < 0 ||
        containerScrollWidth > containerWidth + widthOfLastButton ||
        containerScrollHeight > containerHeight
      const needToIncrementMenusRevealingMenu =
        needToIncrementMenus && menusCount === 0
      // TODO: instead of buttonWidth, use the passed in width of the first menu
      const needToDecrementMenus =
        growableSpace > widthOfFirstMenu && menusCount > 0
      const needToDecrementMenusHidingMenu =
        needToDecrementMenus && menusCount < 3

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
      //   buttons,
      //   menus,
      //   childrenCount,
      //   menusCount,
      //   titleWidth,
      // })

      if (needToIncrementMenusRevealingMenu) {
        return incrementMenusCountRevealingMenu()
      }
      if (needToIncrementMenus) return incrementMenusCount()
      if (needToDecrementMenusHidingMenu) {
        return decrementMenusCountHidingMenu()
      }
      if (needToDecrementMenus) decrementMenusCount()
    }, [menusCount])

    const checkOverflowDebounced = useDebouncedCallback(checkOverflow, 300)

    useEffect(() => {
      // reset children count
      setMenusCount(0)
      // and check overflow when preview changes
      // console.log('MenuBar.useEffect, calling checkOverflow')
      checkOverflow()
    }, [rerenderer])

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
    }, [previousWidthRef.current, rerenderer, menusCount])

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
            {buttons}
            {!!menus.length && (
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
                  {menus}
                </StyledMenu>
              </>
            )}
          </StylingContainer>
        </InnerContainer>
      </MeasuredOuterContainer>
    )
  },
)
