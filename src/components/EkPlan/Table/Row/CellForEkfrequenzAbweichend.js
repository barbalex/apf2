import React, { useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../storeContext'
import Checkbox from './Checkbox'
import { TableCellForSelect } from '../index'

const CellForEkfrequenzAbweichend = ({ field, row }) => {
  const store = useContext(storeContext)

  return (
    <TableCellForSelect width={field.width}>
      <Checkbox
        row={row.tpop}
        value={field.value}
        field="ekfrequenzAbweichend"
      />
    </TableCellForSelect>
  )
}

export default observer(CellForEkfrequenzAbweichend)
