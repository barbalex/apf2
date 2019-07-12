import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { StyledCellForSelect } from './index'

import storeContext from '../../../storeContext'
import SelectGrouped from './Row/SelectGrouped'

const CellForEkfrequenz = ({ row, field, style }) => {
  const store = useContext(storeContext)
  const { ekfOptionsGroupedPerAp } = store.ekPlan

  return (
    <StyledCellForSelect style={style}>
      <SelectGrouped
        optionsGrouped={ekfOptionsGroupedPerAp[row.apId]}
        row={row}
        val={field}
        field="ekfrequenz"
      />
    </StyledCellForSelect>
  )
}

export default observer(CellForEkfrequenz)
