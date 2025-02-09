import { memo, useRef } from 'react'
import styled from '@emotion/styled'

import { useOnScreen } from '../../../../modules/useOnScreen.js'
import { Visible } from './Visible.jsx'

const RowContainer = styled.div`
  display: flex;
  height: 60px;
  min-height: 60px;
`

export const TpopRow = memo(({ tpop, index, setProcessing, years }) => {
  const ref = useRef(null)
  const isVisible = useOnScreen(ref)

  return (
    <RowContainer ref={ref}>
      {isVisible && (
        <Visible
          tpop={tpop}
          index={index}
          setProcessing={setProcessing}
          years={years}
        />
      )}
    </RowContainer>
  )
})
