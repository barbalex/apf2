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
import { FaBars, FaAlignLeft } from 'react-icons/fa6'
import styled from 'styled-components'

const Container = styled.div`
  padding: 5px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  column-gap: 5px;
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
  {
    title: 'Tool 1',
    iconComponent: <FaAlignLeft />,
    onClick: () => console.log('Tool 1'),
  },
  {
    title: 'Tool 2',
    iconComponent: <FaAlignLeft />,
    onClick: () => console.log('Tool 2'),
  },
  {
    title: 'Tool 3',
    iconComponent: <FaAlignLeft />,
    onClick: () => console.log('Tool 3'),
  },
  {
    title: 'Tool 4',
    iconComponent: <FaAlignLeft />,
    onClick: () => console.log('Tool 4'),
  },
  {
    title: 'Tool 5',
    iconComponent: <FaAlignLeft />,
    onClick: () => console.log('Tool 5'),
  },
  {
    title: 'Tool 6',
    iconComponent: <FaAlignLeft />,
    onClick: () => console.log('Tool 6'),
  },
  {
    title: 'Tool 7',
    iconComponent: <FaAlignLeft />,
    onClick: () => console.log('Tool 7'),
  },
  {
    title: 'Tool 8',
    iconComponent: <FaAlignLeft />,
    onClick: () => console.log('Tool 8'),
  },
  {
    title: 'Tool 9',
    iconComponent: <FaAlignLeft />,
    onClick: () => console.log('Tool 9'),
  },
  {
    title: 'Tool 10',
    iconComponent: <FaAlignLeft />,
    onClick: () => console.log('Tool 10'),
  },
]
const buttonWidth = 40

// TODO: pass in Tools as children?
// or rather: need info for menu AND button
// so: object with: title, iconComponent, onClick, width?
// then: build menu and or buttons from that
export const Toolbar = memo(({ tools = testTools }) => {
  const containerRef = useRef(null)
  const [buttons, setButtons] = useState([])
  const [menuItems, setMenuItems] = useState(<div />)

  const onResize = useCallback(({ width }) => {
    console.log('onResize:', { width, testTools })
    // TODO: build menus
    // width of one tool button is toolButtonWidth
    // toolsWidth is tools.length * toolWidth + (tools.length - 1) * columnGapWidth
    // if toolsWidth > container width
    // fit tools into containerWidth - MenuButtonWidth - columnGapWidth
    // fit fitting tools into container
    // add overflowing tools to menu
    setButtons(testTools)
  }, [])

  const { width } = useResizeDetector({
    onResize,
    targetRef: containerRef,
    refreshMode: 'debounce',
    refreshRate: 200,
    refreshOptions: { trailing: true },
  })

  return (
    <Container ref={containerRef}>
      {buttons.map((tool) => (
        <IconButton key={tool.title}>{tool.iconComponent}</IconButton>
      ))}
      <IconButton>
        <FaBars />
      </IconButton>
    </Container>
  )
})
