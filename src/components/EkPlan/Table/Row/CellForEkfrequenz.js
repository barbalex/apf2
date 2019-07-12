import React, { useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TableCellForSelect } from '../index'

import storeContext from '../../../../storeContext'
import SelectGrouped from './SelectGrouped'

const CellForEkfrequenz = ({ row, field }) => {
  const store = useContext(storeContext)
  const {
    resetYearHovered,
    setColumnHovered,
    scrollPositions,
    ekfOptionsGroupedPerAp,
  } = store.ekPlan

  const onMouseEnter = useCallback(() => setColumnHovered(`_${field.label}_`), [
    field,
  ])

  return (
    <TableCellForSelect
      width={field.width}
      onMouseEnter={onMouseEnter}
      onMouseLeave={resetYearHovered}
      data-left={scrollPositions[field.name]}
    >
      <SelectGrouped
        optionsGrouped={ekfOptionsGroupedPerAp[row.apId]}
        row={row}
        val={field}
        field="ekfrequenz"
      />
    </TableCellForSelect>
  )
}

export default observer(CellForEkfrequenz)
