import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TableCellForSelect } from '../index'

import storeContext from '../../../../storeContext'
import SelectGrouped from './SelectGrouped'

const CellForEkfrequenz = ({ row, field }) => {
  const store = useContext(storeContext)
  const { ekfOptionsGroupedPerAp } = store.ekPlan

  return (
    <TableCellForSelect width={field.width}>
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
