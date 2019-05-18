import React from 'react'
import styled from 'styled-components'

import Layout from '../../components/Layout'
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

const Template = () => {
  return (
    <ErrorBoundary>
      <Layout>
        <Container>
          <Doku>
            <p>{`Bitte wählen Sie einen Bereich.`}</p>
          </Doku>
        </Container>
      </Layout>
    </ErrorBoundary>
  )
}

export default Template
