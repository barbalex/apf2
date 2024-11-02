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
import { set } from 'lodash'

const Container = styled.div`
  padding: 5px;
  overflow: hidden;
  margin-left: auto;
  margin-right: 0;
  margin-top: auto;
  margin-bottom: auto;
`
const ToolDiv = styled.div`
  display: inline;
  padding: 0 10px 0 0;
`

const buttonWidth = 40
const gapWidth = 5

// TODO: pass in Tools as children?
// or rather: need info for menu AND button
// so: object with: title, iconComponent, onClick, width?
// then: build menu and or buttons from that
export const MenuBar = memo(({ children }) => {
  const containerRef = useRef(null)
  const [menuItems, setMenuItems] = useState([])
  const [overflowing, setOverflowing] = useState([])

  // need to detect when containerRef overflows
  useLayoutEffect(() => {
    if (!containerRef.current) return
    const { clientWidth, scrollWidth } = containerRef.current
    if (scrollWidth > clientWidth) {
      console.log('overflow')
      setOverflowing(menuItems)
    }
  }, [menuItems])

  const onResize = useCallback(({ width }) => {
    // TODO: build menus
    // width of one tool button is buttonWidth
    // buttonsWidth is tools.length * buttonWidth + (tools.length - 1) * gapWidth
    // if buttonsWidth > container width
    // fit tools into containerWidth - MenuButtonWidth - gapWidth
    // fit fitting tools into container
    // add overflowing tools to menu
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
