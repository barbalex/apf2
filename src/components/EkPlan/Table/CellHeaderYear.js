import React, { useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'
import { StyledYearHeaderCell } from './index'

const CellHeaderYear = ({ style, column }) => {
  const store = useContext(storeContext)
  const { hovered } = store.ekPlan

  const onMouseEnter = useCallback(() => hovered.setYear(column), [
    column,
    hovered,
  ])
  const className = hovered.year === column ? 'column-hovered' : ''

  return (
    <StyledYearHeaderCell
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={hovered.reset}
      className={className}
    >
      <span>{column}</span>
    </StyledYearHeaderCell>
  )
}

export default observer(CellHeaderYear)
