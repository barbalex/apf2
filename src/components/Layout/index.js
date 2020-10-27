/**
 * Cant move Helmet to App
 * because neither StaticQuery nor AppQuery
 * work there :-(
 */
import React from 'react'
import { Helmet } from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'

import AppBar from './AppBar'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100%;

  @media print {
    height: auto;
    overflow: visible !important;
  }
`
const HeaderContainer = styled.div`
  flex-grow: 0;
`
const ContentContainer = styled.div`
  flex-grow: 1;
`

const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
/**
 * ReactDOMServer does not yet support Suspense
 */
const Layout = ({ children }) => {
  const data = useStaticQuery(query)

  return (
    <Container>
      <Helmet
        title={data.site.siteMetadata.title}
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
      <HeaderContainer>
        <AppBar />
      </HeaderContainer>
      <ContentContainer>{children}</ContentContainer>
    </Container>
  )
}

export default Layout
