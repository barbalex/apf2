import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'

import Layout from '../../components/Layout'
import Sidebar from '../../templates/Sidebar'
import ErrorBoundary from '../../components/shared/ErrorBoundary'

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
      filter: { fileAbsolutePath: { regex: "/(/benutzerDoku)/.*.md$/" } }
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
