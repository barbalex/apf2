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
import { BsCaretDown } from 'react-icons/bs'
import { useDebouncedCallback } from 'use-debounce'
import styled from '@emotion/styled'

const height = 40
const collectingMenuWidth = 100

const MeasuredOuterContainer = styled.div`
  overflow: hidden;
  min-height: ${height}px;
  max-height: ${height}px;
  min-width: ${height}; // TODO: remove?
  flex-basis: ${height}px; // TODO: remove?
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
// TODO: reduce to single container
const StylingContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-grow: 1;
  flex-shrink: 0;
  flex-wrap: nowrap;
  column-gap: 0;
  min-height: ${height}px;
  max-height: ${height}px;
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
  flex-wrap: wrap;
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
    bgColor = '#388e3c',
    color = 'white',
  }) => {
    const { visibleChildren, widths } = useMemo(() => {
      const visibleChildren = []
      for (const [index, child] of Children.toArray(children).entries()) {
        visibleChildren.push(child)
      }
      // add 12px for margin and border width to props.width
      const widths = visibleChildren.map((c) => c.props.width + 12)
      return { visibleChildren, widths }
    }, [children])

    const outerContainerRef = useRef(null)
    const outerContainerWidth = outerContainerRef.current?.clientWidth ?? 0
    const previousMeasurementTimeRef = useRef(0)

    const [buttons, setButtons] = useState([])
    const [menus, setMenus] = useState([])

    // this was quite some work to get right
    // overflowing should only be changed as rarely as possible to prevent unnecessary rerenders
    const checkOverflow = useCallback(() => {
      if (!outerContainerRef.current) return

      const containerWidth = outerContainerRef.current?.clientWidth

      const spaceForButtonsAndMenus = containerWidth
      const widthOfAllPassedInButtons = widths.reduce((acc, w) => acc + w, 0)
      const needMenu = widthOfAllPassedInButtons > spaceForButtonsAndMenus
      const spaceForButtons =
        needMenu ?
          spaceForButtonsAndMenus - collectingMenuWidth
        : spaceForButtonsAndMenus
      // sum widths fitting into spaceForButtons
      const newButtons = []
      const newMenus = []
      let widthSum = 0
      for (const [index, child] of Children.toArray(
        visibleChildren,
      ).entries()) {
        const width = child.props.width + 12
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
      //   spaceForButtons,
      //   newButtons,
      //   newMenus,
      // })
    }, [collectingMenuWidth, widths, visibleChildren])

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
      setMenuAnchorEl(event.currentTarget),
    )
    const onCloseMenu = useCallback(() => setMenuAnchorEl(null), [])
    const [menuAnchorEl, setMenuAnchorEl] = useState(null)
    const menuIsOpen = Boolean(menuAnchorEl)

    return (
      <MeasuredOuterContainer
        ref={outerContainerRef}
        bgColor={bgColor}
      >
        <StylingContainer width={outerContainerWidth}>
          {!!menus.length && (
            <>
              <IconButton
                id="menubutton"
                onClick={onClickMenuButton}
              >
                {`+${menus.length}`}
              </IconButton>
              <StyledMenu
                id="menubutton"
                anchorEl={menuAnchorEl}
                open={menuIsOpen}
                onClose={onCloseMenu}
              >
                <MenuContent bgColor={bgColor}>{menus}</MenuContent>
              </StyledMenu>
            </>
          )}
          {buttons}
        </StylingContainer>
      </MeasuredOuterContainer>
    )
  },
)
