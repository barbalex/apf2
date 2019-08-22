import React, { useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { StyledCellForSelect } from './index'

import storeContext from '../../../storeContext'
import SelectGrouped from './SelectGrouped'

const CellForEkfrequenz = ({ row, field, style }) => {
  const store = useContext(storeContext)
  const { ekfOptionsGroupedPerAp, hovered } = store.ekPlan
  const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''
  const onMouseEnter = useCallback(() => hovered.setTpopId(row.id), [
    hovered,
    row.id,
  ])

  return (
    <StyledCellForSelect
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={hovered.reset}
      className={className}
      data-isodd={row.isOdd}
    >
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
