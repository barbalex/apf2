import { Tooltip } from '@mui/material'
import styled from '@emotion/styled'

import { ErrorBoundary } from '../../ErrorBoundary.jsx'

const TitleContainer = styled.div``
const TitleDiv = styled.h3`
  padding: 0 10px;
  font-size: 0.9rem;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.8);
  // center vertically
  margin-top: auto;
  margin-bottom: auto;
  // fix width to prevent jumping
  // but remember to subtract padding
  width: ${(props) => props.titleComponentWidth - 20}px;
  min-width: ${(props) => props.titleComponentWidth - 20}px;
  max-width: ${(props) => props.titleComponentWidth - 20}px;
  // place left
  margin-right: auto;
  display: block;
  overflow: hidden;
  flex-grow: 0;
  flex-shrink: 0;
`
const Content = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 8px;
  row-gap: 2px;
`

const FileNameForTooltip = ({ file, props, ref }) => (
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
)

export const Title = ({ file, numbers, titleComponentWidth }) => {
  if (!file && numbers === undefined) return null

  return (
    <ErrorBoundary>
      <Tooltip title={file ? <FileNameForTooltip file={file} /> : null}>
        <TitleDiv titleComponentWidth={titleComponentWidth}>{numbers}</TitleDiv>
      </Tooltip>
    </ErrorBoundary>
  )
}
