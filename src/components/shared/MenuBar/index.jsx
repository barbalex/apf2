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
  const [width, setWidth] = useAtom(widthAtom)
  console.log('MenuBar, overflowing:', overflowing)

  const checkOverflow = useCallback(() => {
    if (!containerRef.current) return
    const { clientWidth, scrollWidth, scrollHeight, clientHeight } =
      containerRef.current
    const overflowing = scrollHeight > clientHeight || scrollWidth > clientWidth
    return setOverflowing(overflowing)
  }, [overflowing])

  const onResize = useCallback(({ width }) => {
    if (!containerRef.current) return
    // TODO: build menus
    // width of one tool button is buttonWidth
    // buttonsWidth is tools.length * buttonWidth + (tools.length - 1) * gapWidth
    // if buttonsWidth > container width
    // fit tools into containerWidth - MenuButtonWidth - gapWidth
    // fit fitting tools into container
    // add overflowing tools to menu
    const percentageChanged = ((width - previousWidthRef.current) / width) * 100
    const shouldCheckOverflow = Math.abs(percentageChanged) > 1
    console.log('MenuBar.onResize, width:', width)
    // only check overflow if width changed by more than 1%
    console.log('MenuBar.onResize', {
      width,
      previousWidthRef: previousWidthRef.current,
      percentageChanged,
      shouldCheckOverflow,
    })
    if (!shouldCheckOverflow) return
    checkOverflow()
    previousWidthRef.current = width
  }, [])

  useResizeDetector({
    handleHeight: false,
    onResize,
    targetRef: containerRef,
    refreshMode: 'debounce',
    refreshRate: 300,
    refreshOptions: { trailing: true },
  })

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
