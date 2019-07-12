import React, { useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../storeContext'
import Select from './Select'
import { TableCellForSelect } from '../index'

const CellForEkAbrechnungstyp = ({ field, row, ekAbrechnungstypOptions }) => {
  const store = useContext(storeContext)
  const { resetYearHovered, setColumnHovered, scrollPositions } = store.ekPlan

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
