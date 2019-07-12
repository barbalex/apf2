import React, { useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TableCellForSelect } from '../index'

import storeContext from '../../../../storeContext'
import SelectGrouped from './SelectGrouped'

const CellForEkfrequenz = ({
  row,
  field,
  scrollPosition,
  ekfOptionsGroupedPerAp,
}) => {
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
