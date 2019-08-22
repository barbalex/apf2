import React, { useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'
import Select from './Select'
import { StyledCellForSelect } from './index'

const CellForEkAbrechnungstyp = ({ field, row, style }) => {
  const store = useContext(storeContext)
  const { ekAbrechnungstypOptions, hovered } = store.ekPlan
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
      <Select
        options={ekAbrechnungstypOptions}
        row={row}
        val={field}
        field="ekAbrechnungstyp"
      />
    </StyledCellForSelect>
  )
}

export default observer(CellForEkAbrechnungstyp)
