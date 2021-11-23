/**
 * Cant move Helmet to App
 * because neither StaticQuery nor AppQuery
 * work there :-(
 */
import React from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'

import AppBar from './AppBar'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media print {
    height: auto;
    overflow: visible !important;
  }
`

const Layout = ({ children }) => (
  <Container>
    <Helmet
      title="apflora v1.66.0"
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
    <AppBar />
    {children}
  </Container>
)

export default Layout
