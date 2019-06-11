import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'

import Layout from '../components/Layout'
import Sidebar from './Sidebar'
import ErrorBoundary from '../components/shared/ErrorBoundary'

const Container = styled.div`
  margin-top: 64px;
  height: calc(100vh - 64px);
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

const BenutzerDokuTemplate = ({ data }) => {
  const { markdownRemark, mdx } = data
  const md = markdownRemark ? markdownRemark : mdx
  const { frontmatter, html } = md
  const edges = [...data.allMarkdownRemark.edges, ...data.allMdx.edges]

  return (
    <ErrorBoundary>
      <Layout>
        <Container>
          <Sidebar
            title="Benutzer-Dokumentation"
            titleLink="/Dokumentation/Benutzer/"
            edges={edges}
          />
          <Doku>
            <h1>{frontmatter.title}</h1>
            <DokuDate>{frontmatter.date}</DokuDate>
            <div dangerouslySetInnerHTML={{ __html: html }} />
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
      }
    }
    mdx(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "DD.MM.YYYY")
        path
        title
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
    allMdx {
      edges {
        node {
          frontmatter {
            path
            typ
            date(formatString: "DD.MM.YYYY")
            title
          }
        }
      }
    }
  }
`

export default BenutzerDokuTemplate
