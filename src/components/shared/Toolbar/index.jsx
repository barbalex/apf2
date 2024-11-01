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
import { FaBars } from 'react-icons/fa6'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  overflow: hidden;
  padding: 5px;
  float: right;
`
const ToolDiv = styled.div`
  display: inline;
  padding: 0 10px 0 0;
`

const Tools = () => [
  <ToolDiv key={1}>Tool</ToolDiv>,
  <ToolDiv key={2}>Tool</ToolDiv>,
  <ToolDiv key={3}>Tool</ToolDiv>,
  <ToolDiv key={4}>Tool</ToolDiv>,
  <ToolDiv key={5}>Tool</ToolDiv>,
  <ToolDiv key={6}>Tool</ToolDiv>,
  <ToolDiv key={7}>Tool</ToolDiv>,
  <ToolDiv key={8}>Tool</ToolDiv>,
  <ToolDiv key={9}>Tool</ToolDiv>,
  <ToolDiv key={10}>Tool</ToolDiv>,
]

const testTools = [
  { title: 'Tool 1', icon: 'icon1', onClick: () => console.log('Tool 1') },
  { title: 'Tool 2', icon: 'icon2', onClick: () => console.log('Tool 2') },
  { title: 'Tool 3', icon: 'icon3', onClick: () => console.log('Tool 3') },
  { title: 'Tool 4', icon: 'icon4', onClick: () => console.log('Tool 4') },
  { title: 'Tool 5', icon: 'icon5', onClick: () => console.log('Tool 5') },
  { title: 'Tool 6', icon: 'icon6', onClick: () => console.log('Tool 6') },
  { title: 'Tool 7', icon: 'icon7', onClick: () => console.log('Tool 7') },
  { title: 'Tool 8', icon: 'icon8', onClick: () => console.log('Tool 8') },
  { title: 'Tool 9', icon: 'icon9', onClick: () => console.log('Tool 9') },
  { title: 'Tool 10', icon: 'icon10', onClick: () => console.log('Tool 10') },
]

// TODO: pass in Tools as children?
// or rather: need info for menu AND button
// so: object with: title, icon, onClick, width?
// then: build menu and or buttons from that
export const Toolbar = memo(({ tools = testTools }) => {
  const [overflowing, setOverflowing] = useState(false)
  const containerRef = useRef(null)

  const checkOverflow = useCallback(() => {
    const container = containerRef.current
    const isOverflowing = container.scrollWidth > container.clientWidth
    if (isOverflowing !== overflowing) {
      setOverflowing(isOverflowing)
      if (isOverflowing) {
        // TODO: send right tool into menu
      }
    }
  }, [overflowing])

  const { width } = useResizeDetector({
    onResize: checkOverflow,
    targetRef: containerRef,
    refreshMode: 'debounce',
    refreshRate: 200,
    refreshOptions: { trailing: true },
  })

  // width of one tool button is toolButtonWidth
  // toolsWidth is tools.length * toolWidth + (tools.length - 1) * columnGapWidth
  // if toolsWidth > container width
  // fit tools into containerWidth - MenuButtonWidth - columnGapWidth
  // fit fitting tools into container
  // add overflowing tools to menu

  console.log('Toobar, overflowing:', overflowing)

  return (
    <Container ref={containerRef}>
      <Tools />
      <IconButton>
        <FaBars />
      </IconButton>
    </Container>
  )
})
