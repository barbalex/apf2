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
import { over, set } from 'lodash'
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
  background-color: ${(props) => props.bgColor};
  overflow: hidden;
`

export const MenuBar = memo(
  ({
    children,
    rerenderer,
    titleComponent,
    titleComponentWidth,
    bgColor = '#388e3c',
    color = 'white',
    // top menu bar has no margin between menus, others do
    addMargin = true,
  }) => {
    const [buttons, setButtons] = useState([])
    const [menus, setMenus] = useState([])

    const outerContainerRef = useRef(null)
    const outerContainerWidth = outerContainerRef.current?.clientWidth
    const previousMeasurementTimeRef = useRef(0)

    console.log('MenuBar', {
      outerContainerWidth,
    })

    const iconStyle = useMemo(() => ({ color }), [color])

    // this was quite some work to get right
    // overflowing should only be changed as rarely as possible to prevent unnecessary rerenders
    const checkOverflow = useCallback(() => {
      if (!outerContainerRef.current) return

      const usableChildren = children?.filter?.((child) => !!child) ?? children
      const usableChildrenNotHidden = []
      for (const [index, child] of Children.toArray(usableChildren).entries()) {
        console.log('MenuBar.checkOverflow, childProps:', child.props)
        if (child.props.hide === 'true') continue
        usableChildrenNotHidden.push(child)
      }
      // add 12px for margin and border width to props.width
      const widths = usableChildrenNotHidden.map((c) =>
        c.props.width ?
          addMargin ? c.props.width + 12
          : c.props.width
        : buttonWidth,
      )

      // only change if overflowing has changed
      const { clientWidth: containerWidth } = outerContainerRef.current

      const titleWidth = titleComponentWidth ?? 0
      const spaceForButtonsAndMenus = containerWidth - titleWidth
      const widthOfAllPassedInButtons =
        widths ?
          widths.reduce((acc, w) => acc + w, 0)
        : usableChildrenNotHidden.length * buttonWidth
      const needMenu = widthOfAllPassedInButtons > spaceForButtonsAndMenus
      const spaceForButtons =
        needMenu ?
          spaceForButtonsAndMenus - buttonWidth
        : spaceForButtonsAndMenus
      // sum widths fitting into spaceForButtons
      const newButtons = []
      const newMenus = []
      let widthSum = 0
      for (const [index, child] of Children.toArray(usableChildren).entries()) {
        console.log('MenuBar.checkOverflow, childProps:', child.props)
        if (child.props.hide === 'true') continue
        const width = widths?.[index] ?? buttonWidth
        if (widthSum + width > spaceForButtons) {
          newMenus.push(cloneElement(child, { inmenu: 'true' }))
        } else {
          newButtons.push(cloneElement(child))
          widthSum += width
        }
      }
      setButtons(newButtons)
      setMenus(newMenus)
    }, [titleComponentWidth, buttonWidth, children])

    const checkOverflowDebounced = useDebouncedCallback(checkOverflow, 300)

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
        {titleComponent}
        <StylingContainer>
          {buttons}
          {!!menus.length && (
            <>
              <Tooltip title="Mehr Befehle">
                <IconButton
                  id="menubutton"
                  onClick={onClickMenuButton}
                >
                  <FaBars style={iconStyle} />
                </IconButton>
              </Tooltip>
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
        </StylingContainer>
      </MeasuredOuterContainer>
    )
  },
)
