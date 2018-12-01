// @flow
import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import compose from 'recompose/compose'

import ErrorBoundary from './ErrorBoundary'

const Container = styled.div`
  padding-top: 10px;
  @media print {
    display: none;
  }
`

const enhance = compose(
  withState('copied', 'updateCopied', false),
  withHandlers({
    onCopy: ({ updateCopied }) => () => {
      updateCopied(true)
      // can fire after component was unmounted...
      setTimeout(() => {
        updateCopied(false)
      }, 3000)
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
}) => (
  <ErrorBoundary>
    <Container>
      <CopyToClipboard text={text} onCopy={onCopy}>
        <Button color="primary" onCopy={onCopy}>
          {copied ? `${label} kopiert` : `${label} kopieren`}
        </Button>
      </CopyToClipboard>
    </Container>
  </ErrorBoundary>
)

export default enhance(StringToCopy)
