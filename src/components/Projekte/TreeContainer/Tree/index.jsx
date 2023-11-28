import styled from '@emotion/styled'

import Root from './Root'
import IntoViewScroller from './IntoViewScroller'
import Menu from './Menu'

const Container = styled.div`
  height: calc(100% - 53px - 8px);
  width: 100%;
  overflow: auto;
  position: relative;
  ul {
    margin: 0;
    list-style: none;
    padding: 0 0 0 1.1em;
  }
`

const TreeComponent = () => {
  return (
    <Container>
      <Root />
      <IntoViewScroller />
      <Menu />
    </Container>
  )
}

export default TreeComponent
