import React from 'react'
import styled from 'styled-components'

import Layout from '../../components/Layout'
import ErrorBoundary from '../../components/shared/ErrorBoundary'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
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

const Template = () => (
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

export default Template
