/**
 * Cant move Helmet to App
 * because neither StaticQuery nor AppQuery
 * work there :-(
 */
import React from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import AppBar from './AppBar'

const Container = styled.div`
  height: 100%;

  @media print {
    height: auto;
    overflow: visible !important;
  }
`
// TODO: is this element necessary?
const ContentContainer = styled.div`
  height: 100%;
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
    <ContentContainer>{children}</ContentContainer>
  </Container>
)

export default observer(Layout)
