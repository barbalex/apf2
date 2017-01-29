// @flow
import React, { PropTypes } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import FlatButton from 'material-ui/FlatButton'
import styled from 'styled-components'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import compose from 'recompose/compose'

const enhance = compose(
  withState(`copied`, `updateCopied`, false),
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
  copied,
  onCopy,
}) => {
  const Container = styled.div`
    display: flex;
    justify-content: space-between;
  `
  const GuidContainer = styled.div`
    flex-grow: 1;
  `
  const CopyButtonContainer = styled.div`
    margin-top: -7px;
  `

  return (
    <Container>
      <GuidContainer>
        {text}
      </GuidContainer>
      <CopyButtonContainer>
        <CopyToClipboard
          text={text}
          onCopy={onCopy}
        >
          <FlatButton
            label={copied ? `kopiert` : `kopieren`}
          />
        </CopyToClipboard>
      </CopyButtonContainer>
    </Container>
  )
}

StringToCopy.propTypes = {
  text: PropTypes.string.isRequired,
  copied: PropTypes.bool.isRequired,
  onCopy: PropTypes.func.isRequired,
}

export default enhance(StringToCopy)
