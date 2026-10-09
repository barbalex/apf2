import { useRef } from 'react'
import type { TpopId } from '../../../../models/apflora/Tpop.ts'

import { useOnScreen } from '../../../../modules/useOnScreen.ts'
import { Visible } from './Visible.tsx'

import styles from './index.module.css'

export const TpopRow = ({
  tpopId,
  index,
  setProcessing,
  years,
}: {
  tpopId: TpopId
  index: number
  setProcessing: (processing: boolean) => void
  years: number[]
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const isVisible = useOnScreen(ref as React.RefObject<HTMLElement>)

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
