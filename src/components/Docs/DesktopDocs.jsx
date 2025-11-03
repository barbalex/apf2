import { Suspense } from 'react'
import styled from '@emotion/styled'
import { Outlet } from 'react-router'

import { Sidebar } from './DesktopSidebar/index.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { Spinner } from '../shared/Spinner.jsx'

import { container, doku, dokuDate, code } from './DesktopDocs.module.css'

// TODO: update importing components to use css modules
export const Container = styled.div`
  height: 100%;
  display: flex;
  overflow: hidden;
  background-color: #fffde7;
`

// TODO: update importing components to use css modules
export const Doku = styled.div`
  height: 100%;
  width: 100%;
  padding: 0 25px 25px 25px;
  overflow-y: auto;
  scrollbar-width: thin;
  box-sizing: border-box;
  ul,
  ol {
    margin-top: 0;
    padding-inline-start: 20px;
  }
  ol {
    padding-inline-start: 25px;
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
// TODO: update importing components to use css modules
export const DokuDate = styled.p`
  margin-bottom: 15px !important;
  color: grey;
`
// TODO: update importing components to use css modules
export const Code = styled.code`
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0 3px;
`

export const DesktopDocs = () => (
  <ErrorBoundary>
    <div className={container}>
      <Sidebar />
      <div className={doku}>
        <div />
      </div>
    </div>
  </ErrorBoundary>
)
