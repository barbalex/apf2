import { useRef } from 'react'

import { useOnScreen } from '../../../../modules/useOnScreen.js'
import { Visible } from './Visible.jsx'

import { container } from './index.module.css'

export const TpopRow = ({ tpopId, index, setProcessing, years }) => {
  const ref = useRef(null)
  const isVisible = useOnScreen(ref)

  return (
    <div
      className={container}
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
