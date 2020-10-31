import React, { useContext } from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'

import Layout from '../components/Layout'
import Sidebar from './Sidebar'
import ErrorBoundary from '../components/shared/ErrorBoundary'
import storeContext from '../storeContext'

const Container = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  display: flex;
  background-color: #fffde7;
`
const Doku = styled.div`
  width: 100%;
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
  h4,
  ol {
    margin-bottom: 10px;
  }
  h2 {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  display: flex;
  flex-direction: column;
`
const DokuDate = styled.p`
  margin-bottom: 10px !important;
  color: grey;
  padding-left: 25px;
`
const HtmlDiv = styled.div`
  height: 100%;
  margin: ${(props) => (props.pdf ? '0' : '0 25px')};
`
const Title = styled.h1`
  font-size: 1.5rem;
  padding-left: 25px;
  padding-top: 25px;
`

const BenutzerDokuTemplate = ({ data }) => {
  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark
  const edges = data.allMarkdownRemark.edges

  const store = useContext(storeContext)
  const { appBarHeight } = store

  return (
    <ErrorBoundary>
      <Layout>
        <Container data-appbar-height={appBarHeight}>
          <Sidebar
            title="Benutzer-Dokumentation"
            titleLink="/Dokumentation/Benutzer/"
            edges={edges}
          />
          <Doku>
            <Title>{frontmatter.title}</Title>
            <DokuDate>{frontmatter.date}</DokuDate>
            <HtmlDiv
              pdf={frontmatter.pdf}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </Doku>
        </Container>
      </Layout>
    </ErrorBoundary>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "DD.MM.YYYY")
        path
        title
        pdf
      }
    }
    allMarkdownRemark(
      sort: { order: ASC, fields: [frontmatter___sort] }
      filter: { fileAbsolutePath: { regex: "/(/benutzerDoku)/.*.md$/" } }
    ) {
      edges {
        node {
          id
          frontmatter {
            date(formatString: "DD.MM.YYYY")
            path
            title
          }
        }
      }
    }
  }
`

export default BenutzerDokuTemplate
