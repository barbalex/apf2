import { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Button from '@mui/material/Button'

import { ErrorBoundary } from './ErrorBoundary.tsx'
import styles from './StringToCopyOnlyButton.module.css'

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
      <div className={styles.container}>
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
      </div>
    </ErrorBoundary>
  )
}
