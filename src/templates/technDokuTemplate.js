import React from 'react'
import { graphql } from 'gatsby'
import styled from '@emotion/styled'

import Layout from '../components/Layout'
import Sidebar from './Sidebar'
import ErrorBoundary from '../components/shared/ErrorBoundary'

const Container = styled.div`
  height: ${(props) => `calc(100% - ${props.appbarheight}px)`};
  display: flex;
  overflow: hidden;
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
  h4,
  ol {
    margin-bottom: 10px;
  }
  h2 {
    margin-top: 10px;
    margin-bottom: 10px;
  }
`
const DokuDate = styled.p`
  margin-bottom: 15px !important;
  color: grey;
`

const TechnDokuTemplate = ({ data }) => {
  const { allMarkdownRemark } = data
  const frontmatter = data?.markdownRemark?.frontmatter
  const html = data?.markdownRemark?.html
  const { edges } = allMarkdownRemark

  return (
    <ErrorBoundary>
      <Layout>
        <Container>
          <Sidebar
            title="Technische Dokumentation"
            titleLink="/Dokumentation/Technisch/"
            edges={edges}
          />
          <Doku>
            <h1>{frontmatter?.title ?? ''}</h1>
            <DokuDate>{frontmatter?.date ?? ''}</DokuDate>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </Doku>
        </Container>
      </Layout>
    </ErrorBoundary>
  )
}

export const pageQuery = graphql`
  query ($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "DD.MM.YYYY")
        path
        title
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { sort: ASC } }
      filter: { fileAbsolutePath: { regex: "/(/technischeDoku)/.*.md$/" } }
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

export default TechnDokuTemplate
