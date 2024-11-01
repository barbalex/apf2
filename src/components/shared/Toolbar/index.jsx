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
  overflow: hidden;
  max-height: 42px;
`
const ToolDiv = styled.div`
  display: inline;
`

export const Toolbar = memo(() => {
  const [overflowing, setOverflowing] = useState(false)
  const containerRef = useRef(null)

  const checkOverflow = useCallback(() => {
    const container = containerRef.current
    const isOverflowing = container.scrollWidth > container.clientWidth
    if (isOverflowing !== overflowing) setOverflowing(isOverflowing)
  }, [overflowing])

  const { width } = useResizeDetector({
    onResize: checkOverflow,
    targetRef: containerRef,
    refreshMode: 'debounce',
    refreshRate: 100,
    refreshOptions: { trailing: true },
  })

  console.log('Toobar, overflowing:', overflowing)

  return (
    <Container ref={containerRef}>
      <ToolDiv>Toolbar</ToolDiv>
      <ToolDiv>Toolbar</ToolDiv>
      <ToolDiv>Toolbar</ToolDiv>
      <ToolDiv>Toolbar</ToolDiv>
      <ToolDiv>Toolbar</ToolDiv>
    </Container>
  )
})
