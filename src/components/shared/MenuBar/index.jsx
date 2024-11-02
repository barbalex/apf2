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

const testMenus = [
  {
    title: 'Tool 1',
    iconComponent: <FaAlignLeft />,
    onClick: () => console.log('Tool 1'),
  },
  {
    title: 'Tool 2',
    iconComponent: <FaArrowDown />,
    onClick: () => console.log('Tool 2'),
  },
  {
    title: 'Tool 3',
    iconComponent: <FaArrowLeft />,
    onClick: () => console.log('Tool 3'),
  },
  {
    title: 'Tool 4',
    iconComponent: <FaArrowRight />,
    onClick: () => console.log('Tool 4'),
  },
  {
    title: 'Tool 5',
    iconComponent: <FaArrowUp />,
    onClick: () => console.log('Tool 5'),
  },
  {
    title: 'Tool 6',
    iconComponent: <FaCaretDown />,
    onClick: () => console.log('Tool 6'),
  },
  {
    title: 'Tool 7',
    iconComponent: <FaCaretLeft />,
    onClick: () => console.log('Tool 7'),
  },
  {
    title: 'Tool 8',
    iconComponent: <FaCaretRight />,
    onClick: () => console.log('Tool 8'),
  },
  {
    title: 'Tool 9',
    iconComponent: <FaCaretUp />,
    onClick: () => console.log('Tool 9'),
  },
  {
    title: 'Tool 10',
    iconComponent: <FaAlignRight />,
    onClick: () => console.log('Tool 10'),
  },
]
const buttonWidth = 40
const gapWidth = 5

// TODO: pass in Tools as children?
// or rather: need info for menu AND button
// so: object with: title, iconComponent, onClick, width?
// then: build menu and or buttons from that
export const MenuBar = memo(({ menus = testMenus, initFlow, children }) => {
  const containerRef = useRef(null)
  const [menuItems, setMenuItems] = useState([])

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
