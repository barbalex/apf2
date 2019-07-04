import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import Checkbox from './Checkbox'
import { TableCellForSelect } from './index'

const CellForEkfrequenzAbweichend = ({
  field,
  row,
  columnHovered,
  setColumnHovered,
  resetYearHovered,
  scrollPositions,
}) => {
  const onMouseEnter = useCallback(() => setColumnHovered(field.label), [field])

  return (
    <TableCellForSelect
      key={field.label}
      width={field.width}
      onMouseEnter={onMouseEnter}
      onMouseLeave={resetYearHovered}
      data-columnishovered={columnHovered === field.label}
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
