import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'

import Layout from '../../components/Layout'
import Sidebar from '../../templates/Sidebar'
import ErrorBoundary from '../../components/shared/ErrorBoundary'
import Header from '../../components/Head'

const Container = styled.div`
  height: ${(props) => `calc(100% - ${props.appbarheight}px)`};
  display: flex;
  overflow: hidden;
  background-color: #fffde7;
`
const Doku = styled.div`
  height: 100%;
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

export const Head = () => <Header />
