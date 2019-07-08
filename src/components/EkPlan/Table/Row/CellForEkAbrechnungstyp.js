import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import Select from './Select'
import { TableCellForSelect } from '../index'

const CellForEkAbrechnungstyp = ({
  field,
  row,
  setColumnHovered,
  resetYearHovered,
  scrollPositions,
  ekAbrechnungstypOptions,
}) => {
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
      <Select
        options={ekAbrechnungstypOptions}
        row={row}
        val={field}
        field="ekAbrechnungstyp"
      />
    </TableCellForSelect>
  )
}

export default observer(CellForEkAbrechnungstyp)
