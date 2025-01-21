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
import { IconButton, Menu, MenuItem } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
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
import { useDebouncedCallback } from 'use-debounce'

const buttonHeight = 40
export const buttonWidth = 40

const MeasuredOuterContainer = styled.div`
  overflow: hidden;
  min-height: ${buttonHeight}px;
  max-height: ${buttonHeight}px;
  min-width: ${buttonWidth};
  flex-basis: ${buttonWidth}px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  flex-grow: 1;
  flex-shrink: 0;
  column-gap: 0;
  // needed (not transparent) as in fullscreen backed by black
  background-color: ${(props) => props.bgColor};
  border-top: 1px solid rgba(46, 125, 50, 0.15);
  border-bottom: 1px solid rgba(46, 125, 50, 0.15);
`
// StylingContainer overflows parent????!!!!
// Possible solution: pass in max-width
const StylingContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
  flex-shrink: 0;
  flex-wrap: nowrap;
  column-gap: 0;
  min-height: ${buttonHeight}px;
  max-height: ${buttonHeight}px;
  max-width: ${(props) => props.width}px;
  overflow: hidden;
`
// remove the margin mui adds to top and bottom of menu
const StyledMenu = styled(Menu)`
  background-color: ${(props) => props.bgColor};
  overflow: hidden;
  ul {
    padding: 0 !important;
  }
`
const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 3px;
  background-color: ${(props) => props.bgColor};
  overflow: hidden;
  padding: 3px !important;
`

// possible improvement:
// add refs in here to measure their widths
export const MenuBar = memo(
  ({
    children,
    // enable the parent to force rerenders
    rerenderer,
    // files pass in titleComponent and its width
    titleComponent,
    titleComponentWidth,
    bgColor = '#388e3c',
    color = 'white',
    // top menu bar has no margin between menus, others do
    // and that needs to be compensated for
    addMargin = true,
  }) => {
    const [menuAnchor, setMenuAnchor] = useState(null)
    const menuIsOpen = Boolean(menuAnchor)
    const onCloseMenu = useCallback(() => setMenuAnchor(null), [])

    const { visibleChildren, widths } = useMemo(() => {
      const visibleChildren = []
      for (const [index, child] of Children.toArray(children).entries()) {
        visibleChildren.push(child)
      }
      // add 12px for margin and border width to props.width
      const widths = visibleChildren.map((c) =>
        c.props.width ?
          addMargin ? c.props.width + 12
          : c.props.width
        : buttonWidth,
      )
      return { visibleChildren, widths }
    }, [children])

    const outerContainerRef = useRef(null)
    const outerContainerWidth = outerContainerRef.current?.clientWidth
    const previousMeasurementTimeRef = useRef(0)

    const [buttons, setButtons] = useState([])
    const [menus, setMenus] = useState([])

    // this was quite some work to get right
    // overflowing should only be changed as rarely as possible to prevent unnecessary rerenders
    const checkOverflow = useCallback(() => {
      if (!outerContainerRef.current) return

      const containerWidth = outerContainerRef.current?.clientWidth

      const titleWidth = titleComponentWidth ?? 0
      const spaceForButtonsAndMenus = containerWidth - titleWidth
      const widthOfAllPassedInButtons =
        widths ?
          widths.reduce((acc, w) => acc + w, 0)
        : visibleChildren.length * buttonWidth
      const needMenu = widthOfAllPassedInButtons > spaceForButtonsAndMenus
      const spaceForButtons =
        needMenu ?
          spaceForButtonsAndMenus - buttonWidth
        : spaceForButtonsAndMenus
      // sum widths fitting into spaceForButtons
      const newButtons = []
      const newMenus = []
      let widthSum = 0
      for (const [index, child] of Children.toArray(
        visibleChildren,
      ).entries()) {
        const width =
          child.props.width ?
            addMargin ? child.props.width + 12
            : child.props.width
          : buttonWidth
        if (widthSum + width > spaceForButtons) {
          newMenus.push(cloneElement(child, { inmenu: 'true' }))
        } else {
          newButtons.push(cloneElement(child))
          widthSum += width
        }
      }
      setButtons(newButtons)
      setMenus(newMenus)
      // console.log('MenuBar.checkOverflow', {
      //   widths,
      //   visibleChildren,
      //   needMenu,
      //   spaceForButtonsAndMenus,
      //   containerWidth,
      //   titleWidth,
      //   spaceForButtons,
      //   newButtons,
      //   newMenus,
      // })
    }, [titleComponentWidth, buttonWidth, widths, visibleChildren, addMargin])

    const checkOverflowDebounced = useDebouncedCallback(checkOverflow, 300, {
      leading: false,
      trailing: true,
      maxWait: 500,
    })

    useEffect(() => {
      // check overflow when rerenderer changes
      // Example: file preview (any action that changes the menus passed in)
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
        // there is only a single entry...
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
    }, [rerenderer, checkOverflowDebounced])

    const onClickMenuButton = useCallback((event) =>
      setMenuAnchor(event.currentTarget),
    )

    return (
      <MeasuredOuterContainer
        ref={outerContainerRef}
        bgColor={bgColor}
      >
        {titleComponent}
        <StylingContainer
          width={
            Math.abs(outerContainerWidth ?? 0) - (titleComponentWidth ?? 0)
          }
        >
          {buttons}
          {!!menus.length && (
            <>
              <Tooltip title="Mehr Befehle">
                <IconButton
                  id="menubutton"
                  onClick={onClickMenuButton}
                >
                  <FaBars style={{ color }} />
                </IconButton>
              </Tooltip>
              <StyledMenu
                id="menubutton"
                anchorEl={menuAnchor}
                open={menuIsOpen}
                onClose={onCloseMenu}
              >
                <MenuContent
                  bgColor={bgColor}
                  className="menubar-more-menus"
                  // GOAL: close menu on click on menu item
                  // TODO: prevents more menu opening on very narrow screens
                  onClick={onCloseMenu}
                >
                  {menus}
                </MenuContent>
              </StyledMenu>
            </>
          )}
        </StylingContainer>
      </MeasuredOuterContainer>
    )
  },
)
