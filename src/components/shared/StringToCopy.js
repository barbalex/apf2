// @flow
import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import FlatButton from 'material-ui/FlatButton'
import styled from 'styled-components'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import compose from 'recompose/compose'
import { darkBlack } from 'material-ui/styles/colors'

const enhance = compose(
  withState('copied', 'updateCopied', false),
  withHandlers({
    onCopy: props => () => {
      props.updateCopied(true)
      setTimeout(() => {
        props.updateCopied(false)
      }, 10000)
    },
  }),
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
    margin-top: 10px;
    break-inside: avoid;
  `
  const StringToCopyContainer = styled.div`
      display: flex;
      justify-content: space-between;
    `
  const GuidContainer = styled.div`
    flex-grow: 1;
  `
  const CopyButtonContainer = styled.div`
    margin-top: -7px;
  `
  const StyledLabel = styled.div`
    margin-top: 10px;
    cursor: text;
    font-size: 12px;
    color: rgba(0,0,0,0.5);
    pointer-events: none;
    user-select: none;
    padding-bottom: 8px;
  `

  return (
    <Container>
      <StyledLabel>
        {label}
      </StyledLabel>
      <StringToCopyContainer>
        <GuidContainer>
          {text}
        </GuidContainer>
        <CopyButtonContainer>
          <CopyToClipboard text={text} onCopy={onCopy}>
            <FlatButton label={copied ? 'kopiert' : 'kopieren'} />
          </CopyToClipboard>
        </CopyButtonContainer>
      </StringToCopyContainer>
    </Container>
  )
}

export default enhance(StringToCopy)
