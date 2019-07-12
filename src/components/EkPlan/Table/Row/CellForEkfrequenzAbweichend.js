import React, { useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../storeContext'
import Checkbox from './Checkbox'
import { TableCellForSelect } from '../index'

const CellForEkfrequenzAbweichend = ({ field, row, scrollPosition }) => {
  const store = useContext(storeContext)
  const { resetYearHovered, setColumnHovered } = store.ekPlan

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
      <Checkbox
        row={row.tpop}
        value={field.value}
        field="ekfrequenzAbweichend"
      />
    </TableCellForSelect>
  )
}

export default observer(CellForEkfrequenzAbweichend)
