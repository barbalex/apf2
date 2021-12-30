/**
 * Cant move Helmet to App
 * because neither StaticQuery nor AppQuery
 * work there :-(
 */
import React from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
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
      <Helmet
        title="apflora v1.66.27"
        meta={[
          {
            name: 'description',
            content: 'Bedrohte Pflanzenarten fördern',
          },
          {
            name: 'keywords',
            content: 'Naturschutz, Artenschutz, Flora, Pflanzen',
          },
        ]}
      >
        <html lang="de" />
      </Helmet>
      <div ref={resizeRef}>
        <AppBar />
      </div>
      {React.cloneElement(children, { appbarheight })}
    </Container>
  )
}

export default Layout
