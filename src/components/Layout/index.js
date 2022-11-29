import React from 'react'
import styled from '@emotion/styled'
import { useResizeDetector } from 'react-resize-detector'

import AppBar from './AppBar'

const Container = styled.div`
  height: 100%;

  @media print {
    height: auto;
    overflow: visible !important;
  }
`

const Layout = ({ children }) => {
  /**
   * passing appbar height as props to children
   * NOT as store state as that created ui updating conflicts
   */
  const { height: appbarheight, ref: resizeRef } = useResizeDetector()

  //console.log('layout rendering:', { appbarheight, children })

  return (
    <Container>
      <div ref={resizeRef}>
        <AppBar />
      </div>
      {React.cloneElement(children, { appbarheight })}
    </Container>
  )
}

export default Layout
