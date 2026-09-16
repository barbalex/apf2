import { useRef, useState, useEffect, Children, cloneElement } from 'react'
import type { MouseEvent, ReactElement, ReactNode } from 'react'
import { IconButton, Menu } from '@mui/material'
import type { MenuProps } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { FaBars } from 'react-icons/fa6'
import { styled } from '@mui/material/styles'
import { useDebouncedCallback } from 'use-debounce'

import styles from './index.module.css'

const buttonWidth = 40

const StyledMenu = styled((props: MenuProps) => <Menu {...props} />)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: ({ props }: { props?: { bgColor?: string } }) =>
      props?.bgColor,
    overflow: 'hidden',
  },
  '& .MuiList-root': {
    padding: '0 !important',
  },
}))

const getChildren = ({
  addMargin,
  children,
}: {
  addMargin: boolean
  children: ReactNode
}) => {
  const visibleChildren = Children.toArray(children) as ReactElement<{
    width?: number
    inmenu?: string
  }>[]
  // add 12px for margin and border width to props.width
  const widths = visibleChildren.map((c) =>
    c.props.width ?
      addMargin ? c.props.width + 12
      : c.props.width
    : buttonWidth,
  )

  return { visibleChildren, widths }
}

// possible improvement:
// add refs in here to measure their widths
export interface MenuBarProps {
  children: ReactNode
  // enable the parent to force rerenders
  rerenderer?: string
  // files pass in titleComponent and its width
  titleComponent?: ReactNode
  titleComponentWidth?: number
  bgColor?: string
  color?: string
  // top menu bar has no margin between menus, others do
  // and that needs to be compensated for
  addMargin?: boolean
}

export const MenuBar = ({
  children,
  rerenderer,
  titleComponent,
  titleComponentWidth,
  bgColor = '#388e3c',
  color = 'white',
  addMargin = true,
}: MenuBarProps) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const menuIsOpen = Boolean(menuAnchor)
  const onCloseMenu = () => setMenuAnchor(null)

  const { visibleChildren, widths } = getChildren({ addMargin, children })

  const outerContainerRef = useRef<HTMLDivElement>(null)
  const outerContainerWidth = outerContainerRef.current?.clientWidth
  const previousMeasurementTimeRef = useRef(0)

  const [buttons, setButtons] = useState<ReactNode[]>([])
  const [menus, setMenus] = useState<ReactNode[]>([])

  // this was quite some work to get right
  // overflowing should only be changed as rarely as possible to prevent unnecessary rerenders
  const checkOverflow = () => {
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
      needMenu ? spaceForButtonsAndMenus - buttonWidth : spaceForButtonsAndMenus
    // sum widths fitting into spaceForButtons
    const newButtons: ReactNode[] = []
    const newMenus: ReactNode[] = []
    let widthSum = 0
    for (const child of visibleChildren) {
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
  }

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

  const previousWidthRef = useRef<number | null>(null)
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
          ((width - (previousWidthRef.current ?? width)) / width) * 100,
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

  const onClickMenuButton = (event: MouseEvent<HTMLButtonElement>) =>
    setMenuAnchor(event.currentTarget)

  return (
    <div
      className={styles.measuredOuterContainer}
      ref={outerContainerRef}
      style={{ backgroundColor: bgColor }}
    >
      {titleComponent}
      <div
        className={styles.stylingContainer}
        style={{
          maxWidth:
            Math.abs(outerContainerWidth ?? 0) - (titleComponentWidth ?? 0),
        }}
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
              // style={{ backgroundColor: bgColor }}
            >
              <div
                // GOAL: close menu on click on menu item
                // TODO: prevents more menu opening on very narrow screens
                onClick={onCloseMenu}
                style={{ backgroundColor: bgColor }}
                className={`menubar-more-menus ${styles.menuContent}`}
              >
                {menus}
              </div>
            </StyledMenu>
          </>
        )}
      </div>
    </div>
  )
}
