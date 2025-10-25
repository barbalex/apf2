import { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'

import { ErrorBoundary } from './ErrorBoundary.jsx'

const Container = styled.div`
  padding-top: 10px;
  @media print {
    display: none;
  }
`

export const StringToCopyOnlyButton = ({ text, label }) => {
  const [copied, setCopied] = useState(false)
  const onCopy = () => {
    setCopied(true)
    // can fire after component was unmounted...
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  return (
    <ErrorBoundary>
      <Container>
        <CopyToClipboard
          text={text}
          onCopy={onCopy}
        >
          <Button
            color="primary"
            onCopy={onCopy}
          >
            {copied ? `${label} kopiert` : `${label} kopieren`}
          </Button>
        </CopyToClipboard>
      </Container>
    </ErrorBoundary>
  )
}
