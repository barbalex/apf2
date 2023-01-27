import React from 'react'
import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'
import SimpleBar from 'simplebar-react'

import Sidebar from './Sidebar'
import ErrorBoundary from '../shared/ErrorBoundary'

const Container = styled.div`
  height: 100%;
  display: flex;
  overflow: hidden;
  background-color: #fffde7;
  .simplebar-content {
    height: 100% !important;
  }
`
const Doku = styled.div`
  height: 100%;
  width: 100%;
  padding: 25px;
  overflow-y: auto;
  box-sizing: border-box;
  ul,
  ol {
    margin-top: 0;
    padding-inline-start: 20px;
  }
  p,
  li {
    margin-bottom: 3px;
    line-height: 1.5em;
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
  .video-responsive {
    overflow: hidden;
    padding-bottom: 56.25%;
    position: relative;
    height: 0;
  }

  .video-responsive iframe {
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    position: absolute;
  }
  td {
    text-align: right;
  }
  td,
  th {
    padding: 0 5px 0 0;
  }
`
export const DokuDate = styled.p`
  margin-bottom: 15px !important;
  color: grey;
`

const Docs = () => (
  <ErrorBoundary>
    <Container>
      <Sidebar />
      <SimpleBar style={{ height: '100%', width: '100%' }}>
        <Doku>
          <Outlet />
        </Doku>
      </SimpleBar>
    </Container>
  </ErrorBoundary>
)

export default Docs
