import React, { useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../storeContext'
import { EkTableCell } from '../index'

const CellForValue = ({ field, scrollPosition }) => {
  const store = useContext(storeContext)
  const { resetYearHovered, setColumnHovered } = store.ekPlan

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
