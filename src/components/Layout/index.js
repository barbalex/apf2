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
  const store = useContext(storeContext)
  const { appBarHeight } = store
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
      <AppBar />
      <ContentContainer data-appbar-height={appBarHeight}>
        {children}
      </ContentContainer>
    </Container>
  )
}

export default observer(Layout)
