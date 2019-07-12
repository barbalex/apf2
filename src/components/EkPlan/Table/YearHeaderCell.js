import React, { useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'
import { StyledYearHeaderCell } from './index'

const YearHeaderCell = ({ index, style, column }) => {
  const store = useContext(storeContext)
  const { resetYearHovered, setColumnHovered } = store.ekPlan

  const onMouseEnter = useCallback(() => setColumnHovered(`_${column}_`), [
    column,
  ])

  return (
    <StyledYearHeaderCell
      key={column}
      onMouseEnter={onMouseEnter}
      onMouseLeave={resetYearHovered}
      className={`_${column}_`}
    >
      {column}
    </StyledYearHeaderCell>
  )
}

export default observer(YearHeaderCell)
