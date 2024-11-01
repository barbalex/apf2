import {
  memo,
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
} from 'react'
import { useResizeDetector } from 'react-resize-detector'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  overflow: hidden;
  padding: 5px;
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

// TODO: pass in Tools as children?
export const Toolbar = memo(() => {
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

  console.log('Toobar, overflowing:', overflowing)

  return (
    <Container ref={containerRef}>
      <Tools />
    </Container>
  )
})
