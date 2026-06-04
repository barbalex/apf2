import { useState } from 'react'
import Button from '@mui/material/Button'

import { ErrorBoundary } from './ErrorBoundary.tsx'
import styles from './StringToCopyOnlyButton.module.css'

export const StringToCopyOnlyButton = ({ text, label }) => {
  const [copied, setCopied] = useState(false)
  const onCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    // can fire after component was unmounted...
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <Button
          color="primary"
          onClick={onCopy}
        >
          {copied ? `${label} kopiert` : `${label} kopieren`}
        </Button>
      </div>
    </ErrorBoundary>
  )
}
