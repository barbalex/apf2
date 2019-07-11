import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import { EkTableCell } from '../index'

const CellForValue = ({
  field,
  setColumnHovered,
  resetYearHovered,
  scrollPosition,
}) => {
  const { label, value, width } = field
  const onMouseEnter = useCallback(() => setColumnHovered(`_${label}_`), [
    label,
  ])

  return (
    <EkTableCell
      key={label}
      width={width}
      onMouseEnter={onMouseEnter}
      onMouseLeave={resetYearHovered}
      data-left={scrollPosition}
    >
      <div>{value}</div>
    </EkTableCell>
  )
}

export default observer(CellForValue)
