import React, { useContext } from 'react'
import styled from 'styled-components'

import Layout from '../../components/Layout'
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

const Template = () => {
  const store = useContext(storeContext)
  const { appBarHeight } = store

  return (
    <ErrorBoundary>
      <Layout>
        <Container data-appbar-height={appBarHeight}>
          <Doku>
            <p>{`Bitte wählen Sie einen Bereich.`}</p>
          </Doku>
        </Container>
      </Layout>
    </ErrorBoundary>
  )
}

export default Template
