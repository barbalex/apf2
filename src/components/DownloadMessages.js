// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import ErrorBoundary from './shared/ErrorBoundary'

const Container = styled.div`
  position: absolute;
  right: 5px;
  bottom: 5px;
  display: flex;
  flex-direction: column;
  max-width: 700px;
`
const ErrorDiv = styled.div`
  padding: 10px 10px;
  margin: 5px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: #424242;
  color: white;
  max-width: 700px;
  font-size: 14px;
`

const enhance = compose(inject('store'), observer)

const DownloadMessage = ({ store }: { store: Object }) => (
  <ErrorBoundary>
    <Container>
      {store.export.activeDownloads.map((name, index) => (
        <ErrorDiv key={`${index}${name}`}>
          {`Download '${name}' wird vorbereitet...`}
        </ErrorDiv>
      ))}
    </Container>
  </ErrorBoundary>
)

export default enhance(DownloadMessage)
