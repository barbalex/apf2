import React, { useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../storeContext'
import Select from './Select'
import { TableCellForSelect } from '../index'

const CellForEkAbrechnungstyp = ({ field, row }) => {
  const store = useContext(storeContext)
  const { ekAbrechnungstypOptions } = store.ekPlan

  return (
    <TableCellForSelect width={field.width}>
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
