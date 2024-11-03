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

// TODO: pass in Tools as children?
// or rather: need info for menu AND button
// so: object with: title, iconComponent, onClick, width?
// then: build menu and or buttons from that
export const MenuBar = memo(({ children }) => {
  const containerRef = useRef(null)
  const [menuItems, setMenuItems] = useState([])
  const [overflowing, setOverflowing] = useAtom(overflowingAtom)
  console.log('MenuBar, overflowing:', overflowing)

  const checkOverflow = useCallback(() => {
    if (!containerRef.current) return
    const { clientWidth, scrollWidth, scrollHeight, clientHeight } =
      containerRef.current
    const overflowing = scrollHeight > clientHeight || scrollWidth > clientWidth
    setOverflowing(overflowing)
  }, [overflowing])

  const onResize = useCallback(({ width }) => {
    // TODO: build menus
    // width of one tool button is buttonWidth
    // buttonsWidth is tools.length * buttonWidth + (tools.length - 1) * gapWidth
    // if buttonsWidth > container width
    // fit tools into containerWidth - MenuButtonWidth - gapWidth
    // fit fitting tools into container
    // add overflowing tools to menu
    console.log('MenuBar.onResize, width:', width)
    checkOverflow()
  }, [])

  const { width } = useResizeDetector({
    onResize,
    targetRef: containerRef,
    refreshMode: 'debounce',
    refreshRate: 200,
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
