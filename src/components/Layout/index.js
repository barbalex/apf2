/**
 * Cant move Helmet to App
 * because neither StaticQuery nor AppQuery
 * work there :-(
 */
import React from 'react'
import Helmet from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'

import AppBar from './AppBar'
//import Fallback from '../shared/Fallback'

const Container = styled.div`
  @media print {
    height: auto;
    overflow: visible !important;
  }
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
    <ErrorBoundary>
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
        {/*<Suspense fallback={<Fallback />}>*/}
        <AppBar />
        {children}
        {/*</Suspense>*/}
      </Container>
    </ErrorBoundary>
  )
}

export default Layout
