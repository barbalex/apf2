import { useRef } from 'react'

import { useOnScreen } from '../../../../modules/useOnScreen.js'
import { Visible } from './Visible.tsx'

import styles from './index.module.css'

export const TpopRow = ({ tpopId, index, setProcessing, years }) => {
  const ref = useRef(null)
  const isVisible = useOnScreen(ref)

  return (
    <div
      className={styles.container}
      ref={ref}
    >
      {isVisible && (
        <Visible
          tpopId={tpopId}
          index={index}
          setProcessing={setProcessing}
          years={years}
        />
      )}
    </div>
  )
}
