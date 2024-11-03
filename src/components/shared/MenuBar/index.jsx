import {
  memo,
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
} from 'react'
import { useResizeDetector } from 'react-resize-detector'
import { IconButton } from '@mui/material'
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
  const containerRef = useRef(null)
  const [menuItems, setMenuItems] = useState([])
  const [overflowing, setOverflowing] = useAtom(overflowingAtom)
  const previousWidthRef = useRef(null)
  const previousMeasurementTimeRef = useRef(0)
  console.log('MenuBar, overflowing:', overflowing)

  // this was quite some work to get right
  // overflowing should only be changed as rarely as possible to prevent unnecessary rerenders
  const checkOverflow = useCallback(() => {
    if (!containerRef.current) return

    // only change if overflowing has changed
    const { clientWidth, scrollWidth, scrollHeight, clientHeight } =
      containerRef.current
    const nowOverflowing =
      scrollHeight > clientHeight || scrollWidth > clientWidth

    // This somehow prevents changing overflowing from true to false
    // if (nowOverflowing === overflowing) return

    return setOverflowing(nowOverflowing)
  }, [overflowing])

  const checkOverflowDebounced = useDebouncedCallback(checkOverflow, 300)

  useEffect(() => {
    if (!containerRef.current) return
    // set up a resize observer for the container
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        console.log('MenuBar.resizeObserver, measuring')

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
        console.log(
          'MenuBar.resizeObserver, checking if the width has changed enough',
          {
            width,
            previousWidth: previousWidthRef.current,
            percentageChanged,
            shouldCheckOverflow,
          },
        )
        if (!shouldCheckOverflow) return

        // check if the container is overflowing
        previousWidthRef.current = width
        checkOverflowDebounced()
      }
    })

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  // TODO: build menu from menuItems
  return (
    <Container ref={containerRef}>
      {children}
      {/* <IconButton>
        <FaBars />
      </IconButton> */}
    </Container>
  )
})
