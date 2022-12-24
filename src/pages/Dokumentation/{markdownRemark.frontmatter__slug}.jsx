import React from 'react'
import { graphql } from 'gatsby'
import styled from '@emotion/styled'

import Layout from '../../components/Layout'
import Sidebar from '../../templates/Sidebar'
import ErrorBoundary from '../../components/shared/ErrorBoundary'
import '../../templates/benutzerDoku.css'

const Container = styled.div`
  height: ${(props) => `calc(100% - ${props.appbarheight}px)`};
  display: flex;
  overflow: hidden;
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
  const frontmatter = data?.markdownRemark?.frontmatter
  const html = data?.markdownRemark?.html
  const edges = data?.allMarkdownRemark?.edges

  return (
    <ErrorBoundary>
      <Layout>
        <Container>
          <Sidebar
            title="Dokumentation"
            titleLink="/Dokumentation/"
            edges={edges}
          />
          <Doku>
            <Title>{frontmatter?.title ?? ''}</Title>
            <DokuDate>{frontmatter?.date ?? ''}</DokuDate>
            <HtmlDiv
              pdf={frontmatter?.pdf ?? ''}
              dangerouslySetInnerHTML={{ __html: html ?? '<div>nothing</div>' }}
            />
          </Doku>
        </Container>
      </Layout>
    </ErrorBoundary>
  )
}

export const pageQuery = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "DD.MM.YYYY")
        slug
        title
        pdf
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { sort: ASC } } # filter: { fileAbsolutePath: { regex: "/(/doku)/.*.md$/" } }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD.MM.YYYY")
            slug
          }
        }
      }
    }
  }
`

export default BenutzerDokuTemplate
