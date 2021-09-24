import React, { useState, useCallback } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Button from '@mui/material/Button'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from './ErrorBoundary'

const Container = styled.div`
  padding-top: 10px;
  @media print {
    display: none;
  }
`

const StringToCopy = ({ text, label }) => {
  const [copied, setCopied] = useState(false)
  const onCopy = useCallback(() => {
    setCopied(true)
    // can fire after component was unmounted...
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }, [])

  return (
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
}

export default observer(StringToCopy)
