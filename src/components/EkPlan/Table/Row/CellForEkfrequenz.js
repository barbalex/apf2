import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { TableCellForSelect } from '../index'

import SelectGrouped from './SelectGrouped'

const CellForEkfrequenz = ({
  row,
  field,
  setColumnHovered,
  resetYearHovered,
  scrollPosition,
  ekfOptionsGroupedPerAp,
}) => {
  const onMouseEnter = useCallback(() => setColumnHovered(`_${field.label}_`), [
    field,
  ])

  return (
    <TableCellForSelect
      width={field.width}
      onMouseEnter={onMouseEnter}
      onMouseLeave={resetYearHovered}
      data-left={scrollPosition}
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
