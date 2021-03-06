import React, { useContext } from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'

import Layout from '../../components/Layout'
import Sidebar from '../../templates/Sidebar'
import ErrorBoundary from '../../components/shared/ErrorBoundary'
import storeContext from '../../storeContext'

const Container = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  display: flex;
  background-color: #fffde7;
`
const Doku = styled.div`
  width: 100%;
  padding: 25px;
  overflow-y: auto;
  ul {
    margin-top: 0;
  }
  p,
  li {
    margin-bottom: 0;
  }
  h1,
  h3,
  ol {
    margin-bottom: 10px;
  }
  h2 {
    margin-top: 10px;
    margin-bottom: 10px;
  }
`

const Template = ({ data }) => {
  const { allMarkdownRemark } = data
  const { edges } = allMarkdownRemark

  const store = useContext(storeContext)
  const { appBarHeight } = store

  return (
    <ErrorBoundary>
      <Layout>
        <Container data-appbar-height={appBarHeight}>
          <Sidebar
            title="Technische Dokumentation"
            titleLink="/Dokumentation/Technisch/"
            edges={edges}
          />
          <Doku>
            <p>Hier erfahren Sie, wie apflora.ch funktioniert.</p>
            <p>{`<= Bitte wählen Sie ein Thema.`}</p>
          </Doku>
        </Container>
      </Layout>
    </ErrorBoundary>
  )
}

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      sort: { order: ASC, fields: [frontmatter___sort] }
      filter: { fileAbsolutePath: { regex: "/(/technischeDoku)/.*.md$/" } }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD.MM.YYYY")
            path
          }
        }
      }
    }
  }
`

export default Template
