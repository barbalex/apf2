import { memo, forwardRef } from 'react'
import { Tooltip } from '@mui/material'
import styled from '@emotion/styled'

import { ErrorBoundary } from '../ErrorBoundary.jsx'

const TitleContainer = styled.div``
const TitleDiv = styled.h3`
  padding: 0 10px;
  font-size: 0.9rem;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  // center vertically
  margin-top: auto;
  margin-bottom: auto;
  // fix width to prevent jumping
  width: 150px;
  max-width: 150px;
  // place left without using right margin auto
  // as that reduces the width of the menu container
  position: relative;
  top: 0;
  left: 0;
  // break once, then ellipsis
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`
const Content = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 8px;
  row-gap: 2px;
`

const FileNameForTooltip = memo(
  forwardRef(({ file, ...props }, ref) => (
    <TitleContainer
      ref={ref}
      {...props}
    >
      <Content>
        {file.name && (
          <>
            <div>Name:</div>
            <div>{file.name}</div>
          </>
        )}
        {file.fileMimeType && (
          <>
            <div>Typ:</div>
            <div>{file.fileMimeType}</div>
          </>
        )}
        {file.beschreibung && (
          <>
            <div>Beschreibung:</div>
            <div>{file.beschreibung}</div>
          </>
        )}
      </Content>
    </TitleContainer>
  )),
)

export const Title = memo(({ file }) => (
  <ErrorBoundary>
    <Tooltip title={<FileNameForTooltip file={file} />}>
      <TitleDiv>{file.name}</TitleDiv>
    </Tooltip>
  </ErrorBoundary>
))
