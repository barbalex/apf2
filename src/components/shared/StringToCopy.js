// @flow
import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Button from 'material-ui/Button'
import styled from 'styled-components'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import compose from 'recompose/compose'

import ErrorBoundary from './ErrorBoundary'

const enhance = compose(
  withState('copied', 'updateCopied', false),
  withHandlers({
    onCopy: props => () => {
      props.updateCopied(true)
      setTimeout(() => {
        props.updateCopied(false)
      }, 3000)
    },
  })
)

const StringToCopy = ({
  text,
  label,
  copied,
  onCopy,
}: {
  text: string,
  label: string,
  copied: boolean,
  onCopy: () => void,
}) => {
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    padding-bottom: 10px;
    break-inside: avoid;
  `
  const StringToCopyContainer = styled.div`
    display: flex;
    justify-content: space-between;
    position: relative;
  `
  const GuidContainer = styled.div`
    flex-grow: 1;
    &::before {
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      content: '';
      position: absolute;
      transition: background-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      pointer-events: none;
      background-color: rgba(0, 0, 0, 0.1);
      width: 100%;
    }
  `
  const CopyButtonContainer = styled.div`
    margin-top: -7px;
  `
  const StyledLabel = styled.div`
    margin-top: 10px;
    cursor: text;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
    pointer-events: none;
    user-select: none;
    padding-bottom: 8px;
  `

  return (
    <ErrorBoundary>
      <Container>
        <StyledLabel>{label}</StyledLabel>
        <StringToCopyContainer>
          <GuidContainer>{text}</GuidContainer>
          <CopyButtonContainer>
            <CopyToClipboard text={text} onCopy={onCopy}>
              <Button color="primary" onCopy={onCopy}>
                {copied ? `${label} kopiert` : `${label} kopieren`}
              </Button>
            </CopyToClipboard>
          </CopyButtonContainer>
        </StringToCopyContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(StringToCopy)
