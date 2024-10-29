import styled from '@emotion/styled'

import { Root } from './Root/index.jsx'
import { IntoViewScroller } from './IntoViewScroller.jsx'
import { Menu } from './Menu/index.jsx'

const Container = styled.div`
  height: calc(100% - 53px - 8px);
  width: 100%;
  overflow: auto;
  scrollbar-width: thin;
  position: relative;
  contain: paint layout style;
  ul {
    margin: 0;
    list-style: none;
    padding: 0 0 0 1.1em;
  }
`

export const TreeComponent = () => (
  <Container>
    <Root />
    <IntoViewScroller />
    <Menu />
  </Container>
)
