import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import Checkbox from './Checkbox'
import { TableCellForSelect } from '../index'

const CellForEkfrequenzAbweichend = ({
  field,
  row,
  setColumnHovered,
  resetYearHovered,
  scrollPositions,
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
      <Checkbox
        row={row.tpop}
        value={field.value}
        field="ekfrequenzAbweichend"
      />
    </TableCellForSelect>
  )
}

export default observer(CellForEkfrequenzAbweichend)
