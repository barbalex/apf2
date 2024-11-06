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
// left label, right value
const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  column-gap: 10px;
  row-gap: 2px;
`

const Label = styled.div`
  // width: 80px;
  // min-width: 80px;
  display: inline-block;
`
const Value = styled.div`
  display: inline-block;
`

const FileNameForTooltip = memo(
  forwardRef(({ file, ...props }, ref) => (
    <TitleContainer
      ref={ref}
      {...props}
    >
      <Content>
        {file.fileMimeType && (
          <>
            <Label>Typ:</Label>
            <Value>{file.fileMimeType}</Value>
          </>
        )}
        {file.beschreibung && (
          <>
            <Label>Beschreibung:</Label>
            <Value>{file.beschreibung}</Value>
          </>
        )}
      </Content>
    </TitleContainer>
  )),
)

// TODO: pass in Tools as children?
// or rather: need info for menu AND button
// so: object with: title, iconComponent, onClick, width?
// then: build menu and or buttons from that
export const Title = memo(({ file }) => (
  <ErrorBoundary>
    <Tooltip title={<FileNameForTooltip file={file} />}>
      <TitleDiv>{file.name}</TitleDiv>
    </Tooltip>
  </ErrorBoundary>
))
