import React, { useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'
import { StyledYearHeaderCell } from './index'

const YearHeaderCell = ({ style, column }) => {
  const store = useContext(storeContext)
  const { resetYearHovered, columnHovered, setColumnHovered } = store.ekPlan

  const onMouseEnter = useCallback(() => setColumnHovered(column), [column])
  const className = columnHovered === column ? 'hovered' : ''
  //console.log('YearHeaderCell',{columnHovered})

  return (
    <StyledYearHeaderCell
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={resetYearHovered}
      className={className}
    >
      <span>{column}</span>
    </StyledYearHeaderCell>
  )
}

export default observer(YearHeaderCell)
