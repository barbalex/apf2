/**
 * Cant move Helmet to App
 * because neither StaticQuery nor AppQuery
 * work there :-(
 */
import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import AppBar from './AppBar'
import storeContext from '../../storeContext'

const Container = styled.div`
  height: 100%;

  @media print {
    height: auto;
    overflow: visible !important;
  }
`
// TODO: is this element necessary?
const ContentContainer = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
`

const Layout = ({ children }) => {
  const store = useContext(storeContext)
  const { appBarHeight } = store

  return (
    <Container>
      <Helmet
        title="apflora v1.65.3"
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
      <ContentContainer data-appbar-height={appBarHeight}>
        {children}
      </ContentContainer>
    </Container>
  )
}

export default observer(Layout)
